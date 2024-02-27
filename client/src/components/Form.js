import { Formik, Field, Form } from "formik";

const FormUI = ({
  initialValues,
  formItems,
  handleSubmit,
  validations,
  submitBtnText,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validations}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <>
          <Form className="grid gap-3">
            <>
              {formItems.map(({ label, inputProps = {} }) => (
                <Field key={inputProps.name || ""} name={inputProps.name || ""}>
                  {({ field, form }) => (
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">{label}</span>
                      </div>
                      <input
                        {...inputProps}
                        className={`${inputProps.className} ${
                          !!form.errors[inputProps.name]
                            ? "input-error"
                            : form.touched[inputProps.name]
                            ? "input-primary"
                            : ""
                        } input input-bordered w-full`}
                        {...field}
                      />
                      {form.errors[inputProps.name] && (
                        <div className="label">
                          <span className="label-text-alt text-error">
                            {form.errors[inputProps.name]}
                          </span>
                        </div>
                      )}
                    </label>
                  )}
                </Field>
              ))}
              <div className="card-actions justify-end mt-5">
                <button className="btn btn-primary btn-wide max-w-[150px]">
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    ""
                  )}{" "}
                  {submitBtnText}
                </button>
              </div>
            </>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default FormUI;
