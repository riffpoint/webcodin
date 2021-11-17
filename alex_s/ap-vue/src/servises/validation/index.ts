interface Response {
  status: boolean;
  message: string;
}

class ValidationService {
  Required(value: string): Response {
    return {
      status: !!value,
      message: "",
    };
  }

  Email(email: string): Response {
    const reg =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]{1,32}@[a-zA-Z0-9-]{1,10}(?:\.[a-zA-Z0-9-]{1,10}){1,3}$/;

    return {
      status: reg.test(email),
      message: "",
    };
  }

  Password(password: string): Response {
    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return {
      status: reg.test(password),
      message: "",
    };
  }
}

export default new ValidationService();
