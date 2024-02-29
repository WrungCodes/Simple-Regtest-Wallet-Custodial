import { useCallback, useMemo } from "react";
import { useGetAllDataQuery, useLogoutUserMutation } from "../api";
import BankAccounts from "../widgets/BankAccounts";
import TransferForm from "../widgets/TransferForm";
import WalletDetails from "../widgets/WalletDetails";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { data, isLoading } = useGetAllDataQuery();
  const [logout] = useLogoutUserMutation();
  const isNew = useMemo(() => data && !data.accounts.length, [data]);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {}
  }, [logout, navigate]);

  return (
    <div className="relative h-full w-full">
      <div className="flex items-center justify-between px-8 pt-6 absolute w-full top-0">
        <p className="text-2xl font-semibold dark:text-white">
          Hello {data && data.user && data.user.name}
        </p>

        <div>
          <button
            className="btn btn-outline md:btn-md btn-sm btn-wide max-w-[150px]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto h-full w-11/12 flex items-center">
        <div className="grid md:grid-cols-3 w-full gap-5">
          <div className={isNew ? "col-span-3" : "col-span-1"}>
            {isLoading ? (
              <div className="skeleton w-full h-full"></div>
            ) : (
              <BankAccounts accounts={data && data.accounts} />
            )}
          </div>

          {!isNew && (
            <div className="md:col-span-2 flex flex-col gap-4">
              <div>
                {isLoading ? (
                  <div className="skeleton w-full h-[100px]"></div>
                ) : (
                  <WalletDetails wallet={data && data.wallet} />
                )}
              </div>
              <div>
                {isLoading ? (
                  <div className="skeleton w-full h-[300px]"></div>
                ) : (
                  data &&
                  data.wallet &&
                  data.wallet.asset && (
                    <TransferForm asset={data.wallet.asset} />
                  )
                )}
                {}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
