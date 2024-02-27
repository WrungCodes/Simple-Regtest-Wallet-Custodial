import { useCallback, useEffect, useMemo, useState } from "react";
import { useFetchRatesQuery, useTradeAssetMutation } from "../api";
import { useSelector, useDispatch } from "react-redux";
import { setBankId } from "../store/reducers";
import { toast } from "react-toastify";

const TransferForm = ({ asset = {} }) => {
  const { data: rate, refetch, isFetching } = useFetchRatesQuery(asset.id);
  const [tradeAssets] = useTradeAssetMutation();
  const [amount, setAmount] = useState(0.0);
  const [assetEquivalent, setAssetEquivalent] = useState(0.0);
  const [error, setError] = useState("");
  const assetRate = useMemo(
    () => Number(rate ? rate.rate.toString().split(".")[0] : 0),
    [rate]
  );
  const { bankId } = useSelector((state) => state.transaction);
  const dispatch = useDispatch();
  const [processingTransaction, setProcessingTransaction] = useState(false);

  const handleChange = useCallback(
    (event) => {
      const val = Number(event.target.value);

      if (!val) {
        setError("Invalid amount");
      } else {
        setError("");
      }

      setAmount(val);
      setAssetEquivalent((val / assetRate).toFixed(asset.decimal || 8));
    },
    [assetRate, asset]
  );

  const validateEntries = useCallback(() => {
    if (!bankId) {
      toast("Please select a bank", {
        type: "warning",
      });

      return false;
    }

    if (error) {
      toast("Enter valid amount", {
        type: "warning",
      });

      return false;
    }

    return true;
  }, [bankId, error]);

  const handleTrade = useCallback(
    async (e) => {
      try {
        e.preventDefault();

        if (!validateEntries()) {
          return;
        }

        if (!bankId) {
          toast("Please select a bank", {
            type: "warning",
          });

          return;
        }
        setProcessingTransaction(true);

        const response = await tradeAssets({
          bankId,
          assetId: asset.id,
          amount,
        });

        if (!response.error) {
          toast("Trade Successful", {
            type: "success",
          });
        }

        dispatch(setBankId(null));
        setAmount(0);
        setAssetEquivalent(0);
      } catch (e) {}
      setProcessingTransaction(false);
    },
    [validateEntries, bankId, tradeAssets, asset.id, amount, dispatch]
  );

  useEffect(() => {
    setAssetEquivalent((amount / assetRate).toFixed(asset.decimal || 8));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  return (
    <div className="card border border-[rgba(255,255,255,0.2)] h-full">
      <div className="card-body relative">
        <button
          className="absolute top-3 right-3 flex gap-1"
          onClick={() => refetch()}
        >
          {isFetching ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <p className="text-xs">Refresh rate</p>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6_13405)">
                  <path
                    d="M17.6498 6.35C16.1998 4.9 14.2098 4 11.9998 4C7.57977 4 4.00977 7.58 4.00977 12C4.00977 16.42 7.57977 20 11.9998 20C15.7298 20 18.8398 17.45 19.7298 14H17.6498C16.8298 16.33 14.6098 18 11.9998 18C8.68977 18 5.99977 15.31 5.99977 12C5.99977 8.69 8.68977 6 11.9998 6C13.6598 6 15.1398 6.69 16.2198 7.78L12.9998 11H19.9998V4L17.6498 6.35Z"
                    fill="#ffffff"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_13405">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </>
          )}
        </button>

        <form onSubmit={handleTrade}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Amount</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="0.000000"
                className={`input input-bordered w-full text-white ${
                  error ? "input-error" : amount ? "input-primary" : ""
                }`}
                value={amount}
                onChange={handleChange}
              />
              <div className="h-full absolute top-0 flex items-center right-4">
                <p>USD</p>
              </div>
            </div>
            {error && (
              <div className="label">
                <span className="label-text">{error}</span>
              </div>
            )}
          </label>
          <div className="mt-4">
            <div className="flex flex-col w-full">
              <div className="divider divider-vertical">
                @ {assetRate} USD/
                {asset.symbol}
              </div>
              <div className="rounded-lg px-4 py-3 bg-[rgba(0,0,0,0.05)] flex items-center justify-between">
                <p className="text-white ">{assetEquivalent}</p>
                <p className="text-right">{asset.symbol}</p>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-5">
            <button
              disabled={processingTransaction}
              className="btn btn-primary btn-wide max-w-[150px]"
            >
              {processingTransaction ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Trade"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;
