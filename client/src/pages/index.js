import { useMemo } from "react";
import { useGetAllDataQuery } from "../api";
import BankAccounts from "../widgets/BankAccounts";
import TransferForm from "../widgets/TransferForm";
import WalletDetails from "../widgets/WalletDetails";

const HomePage = () => {
  const { data } = useGetAllDataQuery();
  const isNew = useMemo(() => data && !data.accounts.length, [data]);

  return (
    <div className="relative h-full w-full">
      <div className=""></div>
      <div className="max-w-[900px] mx-auto h-full w-11/12 flex items-center">
        <div className="grid md:grid-cols-3 w-full gap-5">
          <div className={isNew ? "col-span-3" : "col-span-1"}>
            <BankAccounts accounts={data && data.accounts} />
          </div>

          {!isNew && (
            <div className="md:col-span-2 flex flex-col gap-4">
              <div>
                <WalletDetails wallet={data && data.wallet} />
              </div>
              <div>
                <TransferForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
