type ValidatorType = string | [string, ValidatorCallBack] | ObjectValidator;

type ValidatorCallBack = (
  value: any,
  validate: (
    object: any,
    validators: ValidatorType[],
    error?: string
  ) => boolean | string
) => boolean | string;

interface ObjectValidator {
  property: string;
  validate: ValidatorCallBack;
}

interface FailInterface {
  missing: string[];
  invalid: { property: string; error: string }[];
  valid: false;
  checked: null;
}

interface PassInterface {
  missing: null;
  invalid: null;
  valid: true;
  checked: { [key: string]: any };
}

export { PassInterface, FailInterface, ValidatorType };
