import { useCallback, useEffect, useState } from "react";
import {
  useAddPublicTokenMutation,
  useInitializeBankLinkMutation,
} from "../api";
import { usePlaidLink } from "react-plaid-link";

const BankAccounts = ({ accounts = [] }) => {
  const [initBankLink] = useInitializeBankLinkMutation();
  const [addPublicToken] = useAddPublicTokenMutation();
  const [linkToken, setLinkToken] = useState("");
  const [creatingLink, setCreatingLink] = useState(false);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      // send public_token to server
      try {
        const response = await addPublicToken({ publicToken: public_token });

        setLinkToken("");
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleGenerateLinkToken = useCallback(async () => {
    setCreatingLink(true);
    try {
      const response = await initBankLink();
      setLinkToken(response.data.link);
    } catch (e) {
      console.log(e);
    }
    setCreatingLink(false);
  }, [initBankLink]);

  useEffect(() => {
    if (ready && linkToken) {
      console.log("here");
      open();
    }
  }, [ready, linkToken, open]);

  return (
    <div className="card border border-[rgba(255,255,255,0.2)] w-full min-h-[300px] h-full">
      <div className="card-body h-full">
        <p className="text-xl font-bold text-white">Bank accounts</p>

        <div className="h-[calc(100%-50px)] overflow-auto flex items-center justify-center">
          {accounts.length ? (
            <ul className="h-full w-full">
              <li className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.2)]">
                <div className="text-xs">
                  <p>Plaid Checking</p>
                  <p>
                    Available Balance: <b className="text-white">$100</b>
                  </p>
                </div>

                <div>
                  <input type="checkbox" className="checkbox" />
                </div>
              </li>
            </ul>
          ) : (
            <div className="text-center">
              <p>Could not find any bank account linked</p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;
