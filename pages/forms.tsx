//

import { useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
  email: string;
  error?: string;
}

export default function Forms() {
  // register input과 이어주는 역할
  // watch() 는 register가 변화할때마다 감지
  //   handleSubmit은 2개의 인자를 받는다 onValid, onInvalid (각각 유효할때, 유효하지 않을때 실행되는 함수)
  //   formState : { errors } -> error들만 받음
  const {
    register,
    /*watch,*/ handleSubmit,
    formState: { errors },
    setError,
    reset,
    resetField,
  } = useForm<LoginForm>();

  // form이 유효할때 실행
  const onValid = (data: LoginForm) => {
    console.log(data);
    reset(); // form내 전체 input reset
    resetField("username"); // form 내 username이라는 이름의 register reset
  };

  // onInvalid parameter 타입지정 -> form이 유효하지 않을때 실행
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
    setError("error", { message: "오류 나는 시점 조정가능" });
  };
  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", {
          // required에 message를 작성가능
          required: "이름을 작성해주세요",
          minLength: {
            message: "길이는 최소 5글자입니다.",
            value: 5,
          },
        })}
        type="text"
        placeholder="Username"
        className={`${Boolean(errors.username) ? "border-red-500" : ""}`}
      />
      {errors.username?.message}
      {errors.error?.message}
      <input
        {...register("email", {
          required: "이메일을 작성해주세요",
          // validation 추가
          validate: {
            notGmail: (value) => !value.includes("@gmail") || "gmail은 사용이 안됩니다",
          },
        })}
        type="email"
        placeholder="Email"
      />
      <input
        {...register("password", {
          required: "비밀번호를 작성해주세요",
        })}
        type="password"
        placeholder="Password"
      />
      <input type="submit" value={"asd"} />
    </form>
  );
}
