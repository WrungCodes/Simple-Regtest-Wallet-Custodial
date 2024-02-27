const TransferForm = () => {
  return (
    <div className="card border border-[rgba(255,255,255,0.2)] h-full">
      <div className="card-body relative">
        <div className="absolute top-3 right-3 flex gap-1">
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
        </div>

        <form>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Amount</span>
            </div>
            <input
              type="text"
              placeholder="0.000000"
              className="input input-bordered w-full"
            />
          </label>
          <div className="mt-4">
            <div className="flex flex-col w-full">
              <div className="divider divider-vertical">@360/$</div>
              <div className="rounded-lg px-4 py-3 bg-[rgba(0,0,0,0.05)] text-white">
                00.00
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-5">
            <button className="btn btn-primary btn-wide max-w-[150px]">
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;
