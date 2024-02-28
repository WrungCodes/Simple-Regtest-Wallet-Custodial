import { useCallback, useEffect, useState } from "react";
import {
  useAddPublicTokenMutation,
  useInitializeBankLinkMutation,
} from "../api";
import { usePlaidLink } from "react-plaid-link";
import { useSelector, useDispatch } from "react-redux";
import { setBankId } from "../store/reducers";
import { useNavigate } from "react-router-dom";

const BankAccounts = ({ accounts = [] }) => {
  const [initBankLink] = useInitializeBankLinkMutation();
  const [addPublicToken] = useAddPublicTokenMutation();
  const [linkToken, setLinkToken] = useState("");
  const [creatingLink, setCreatingLink] = useState(false);
  const { bankId } = useSelector((state) => state.transaction);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timerId, setTimerId] = useState(null);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await addPublicToken({ publicToken: public_token });
        setLinkToken("");
      } catch (e) {
      }
      setCreatingLink(false);
    },
    onExit: async () => {
      setCreatingLink(false);
    },
    onEvent: async () => {
      clearTimeout(timerId);
    }
  });

  /**
   * There is a reoccurring bug where the page has to be reloaded to be able to open plaid sdk
   * becuase the `ready` sometime does not ever become true until page refresh
   * https://github.com/plaid/react-plaid-link/issues/285
   * this is a hacky way of working around it
   * 
   */
  const setTimeOutToRetryHandleGenerateLinkToken = () => {
    const timeout = 4000; // Set timeout as 4 seconds

    // create a timeout
    const id = setTimeout(async () => {
      // get the correct url of the page and add a query param
      const currentUrl = new URL(window.location);
      currentUrl.searchParams.set('retryHandleGenerateLinkToken', 'true');
      window.history.pushState({}, '', currentUrl);

      // reload the page
      window.location.reload();
    }, timeout);
    setTimerId(id); // Store the timer ID to manage it later
  }

  const checkAndRetryHandleGenerateLinkToken = () => {
    // fetch the url param to see if we should try again
    const urlParams = new URLSearchParams(window.location.search);
    const shouldRetryHandleGenerateLinkToken = urlParams.get('retryHandleGenerateLinkToken') === 'true';
  
    if (shouldRetryHandleGenerateLinkToken) {
      handleGenerateLinkToken();
  
      // Clear the parameter immediately after checking
      urlParams.delete('retryHandleGenerateLinkToken');

      // return url to what it was
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }
  }

  const handleGenerateLinkToken = useCallback(async () => {
    setCreatingLink(true);
    clearTimeout(timerId);

    try {
      const response = await initBankLink();
      setLinkToken(response.data.link);

      setTimeOutToRetryHandleGenerateLinkToken()
    } catch (e) {
    }
  }, [initBankLink, navigate]);

  useEffect(() => {
    if (ready && linkToken) {
      open();
    }

    checkAndRetryHandleGenerateLinkToken()
  }, [ready, linkToken, open]);

  return (
    <div className="card border border-[rgba(255,255,255,0.2)] w-full min-h-[300px] h-full">
      <div className="card-body">
        <div>
          <p className="text-xl font-bold text-white grow-0">Bank accounts</p>
        </div>

        <div className="overflow-auto max-h-[350px] no-scrollbar">
          <div className="w-full">
            {accounts.length ? (
              <ul className="h-full w-full">
                {accounts.map(({ official_name, balances, name, id }) => (
                  <li className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.2)] [&:not(:first-child)]:pt-4">
                    <div className="text-xs grid gap-1">
                      <p className="font-bold">{official_name}</p>
                      <p>{name}</p>
                      <p>
                        Available Balance:{" "}
                        <b className="text-white">
                          {balances.available}
                          {balances.iso_currency_code}
                        </b>
                      </p>
                    </div>

                    <div>
                      <input
                        type="checkbox"
                        checked={bankId === id}
                        onChange={() => dispatch(setBankId(id))}
                        className="checkbox"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center mt-14">
                <p>Could not find any bank account linked</p>
              </div>
            )}
            <div className="text-center">
              <button
                className="btn mt-4"
                disabled={creatingLink}
                onClick={handleGenerateLinkToken}
              >
                {creatingLink ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  " Link Account"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;