const WalletDetails = ({ wallet = {} }) => {
  return (
    <div className="card border dark:border-[rgba(255,255,255,0.2)]">
      <div className="card-body flex-row items-center justify-between">
        <p className="text-xs">
          Wallet Address: <br />
          <b className="dark:text-white">{wallet.address}</b>
        </p>
        <p className="text-xs text-right">
          Balance: <br />
          <b className="dark:text-white">
            {wallet.balance} {wallet.asset && wallet.asset.symbol}
          </b>
        </p>
      </div>
    </div>
  );
};

export default WalletDetails;
