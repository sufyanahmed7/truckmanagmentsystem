import * as Yup from 'yup';

export const dataSchema = Yup.object({
  account: Yup.string()
    .required("Account is required")
    .test("unique-account", "Account must be unique", function (value) {
      const { formList, selectedCompany } = this.options.context as {
        formList: any[];
        selectedCompany: number | null;
      };

      if (!value) return true;

      const normalizedValue = value.toLowerCase();

      const isDuplicate = formList.some((item, index) => {
        if (selectedCompany !== null && index === selectedCompany) return false;
        return item.account.toLowerCase() === normalizedValue;
      });

      return !isDuplicate;
    }),
  company: Yup.string().trim().required('Company is Required'),
  email: Yup.string().trim().email('Invalid Email').required('Email is required'),
  phone: Yup.string().trim().optional(),
  firstname: Yup.string().trim().optional(),
  lastname: Yup.string().trim().optional()
});