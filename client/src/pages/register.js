import { Link, useNavigate } from "react-router-dom";
import FormUI from "../components/Form";
import { RegisterSchema } from "../utils/form-validations";
import { useRegisterUserMutation } from "../api";
import { useCallback } from "react";

const RegisterPage = () => {
  const [registerUser, result] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleRegisterUser = useCallback(
    async (data) => {
      try {
        const response = await registerUser(data);
        console.log(result, response);

        navigate("/login");
      } catch (e) {
        console.log(e);
      }
    },
    [registerUser, result, navigate]
  );

  return (
    <div className="h-full w-full">
      <div className="text-right pt-4 pr-4 flex items-center justify-end gap-4">
        <p className="md:text-base text-xs">Already have an account?</p>
        <Link
          to="/login"
          className="btn btn-outline md:btn-md btn-sm btn-wide max-w-[150px]"
        >
          Log in
        </Link>
      </div>
      <div className="h-full w-full flex items-center justify-center -mt-10">
        <div className="card max-w-[500px] md:card-normal card-compact mx-5 md:mx-0 w-full border border-[rgba(255,255,255,0.2)]">
          <div className="card-body">
            <div>
              <div className="card-title">
                <p>Create your account</p>
              </div>
              <p></p>
            </div>

            <FormUI
              initialValues={{}}
              formItems={[
                {
                  label: "Name",
                  inputProps: {
                    type: "text",
                    name: "name",
                    placeholder: "Type here",
                  },
                },
                {
                  label: "Email",
                  inputProps: {
                    type: "email",
                    name: "email",
                    placeholder: "Type here",
                  },
                },
                {
                  label: "Password",
                  inputProps: {
                    type: "password",
                    name: "password",
                    placeholder: "Type here",
                  },
                },
              ]}
              validations={RegisterSchema}
              submitBtnText="Register"
              handleSubmit={handleRegisterUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
