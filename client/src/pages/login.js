import { Link, useNavigate } from "react-router-dom";
import FormUI from "../components/Form";
import { LoginSchema } from "../utils/form-validations";
import { useCallback } from "react";
import { useLoginUserMutation } from "../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();

  const handleLoginUser = useCallback(
    async (data) => {
      try {
        const response = await loginUser(data);
        if (!response.error) {
          navigate("/");
        }
      } catch (e) {
      }
    },
    [loginUser, navigate]
  );

  return (
    <div className="h-full w-full">
      <div className="text-right pt-4 pr-4 flex items-center justify-end gap-4">
        <p className="md:text-base text-xs">Create a new account</p>
        <Link
          to="/register"
          className="btn btn-outline md:btn-md btn-sm btn-wide max-w-[150px]"
        >
          Register
        </Link>
      </div>
      <div className="h-full w-full flex items-center justify-center -mt-10">
        <div className="card max-w-[500px] md:card-normal card-compact mx-5 md:mx-0 w-full border border-[rgba(255,255,255,0.2)]">
          <div className="card-body">
            <div>
              <div className="card-title">
                <p>Welcome back</p>
              </div>
              <p>Log back into your account </p>
            </div>

            <FormUI
              initialValues={{}}
              formItems={[
                {
                  label: "Email Address",
                  inputProps: {
                    placeholder: "Type here",
                    name: "email",
                  },
                },
                {
                  label: "Password",
                  inputProps: {
                    type: "password",
                    placeholder: "Type here",
                    name: "password",
                  },
                },
              ]}
              validations={LoginSchema}
              submitBtnText="Log in"
              handleSubmit={handleLoginUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
