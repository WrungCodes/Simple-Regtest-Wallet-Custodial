import { useCallback, useEffect, useState } from "react";
import {
  useAddPublicTokenMutation,
  useInitializeBankLinkMutation,
} from "../api";
import { usePlaidLink } from "react-plaid-link";
import { useSelector, useDispatch } from "react-redux";
import { setBankId } from "../store/reducers";

const BankAccounts = ({ accounts = [] }) => {
  const [initBankLink] = useInitializeBankLinkMutation();
  const [addPublicToken] = useAddPublicTokenMutation();
  const [linkToken, setLinkToken] = useState("");
  const [creatingLink, setCreatingLink] = useState(false);
  const { bankId } = useSelector((state) => state.transaction);
  const dispatch = useDispatch();

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await addPublicToken({ publicToken: public_token });
        setLinkToken("");
      } catch (e) {
      }
    }
  });

  const handleGenerateLinkToken = useCallback(async () => {
    setCreatingLink(true);
    try {
      const response = await initBankLink();
      setLinkToken(response.data.link);
    } catch (e) {
    }
    setCreatingLink(false)
  }, [initBankLink]);

  useEffect(() => {
    handleGenerateLinkToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                disabled={!ready}
                onClick={() => open()}
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