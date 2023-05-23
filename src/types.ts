type ValidatorType = string | [string, ValidatorCallBack] | ObjectValidator;

type ValidatorCallBack = (
  value: any,
  validate: (object: any, validators: ValidatorType[]) => boolean
) => boolean;

interface ObjectValidator {
  property: string;
  validate: ValidatorCallBack;
}

interface FailInterface {
  missing: string[];
  invalid: string[];
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
