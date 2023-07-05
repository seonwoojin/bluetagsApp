import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { Path, Svg } from "react-native-svg";
import { TouchableWithoutFeedback } from "react-native";
import { useEffect, useRef, useState } from "react";
import useMutation from "../../libs/useMutation";
import { useForm } from "react-hook-form";
import { User } from "../../libs/schema";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavParamList } from "../../navigation/Root";
import { API_KEY } from "react-native-dotenv";
import Constants from "expo-constants";

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;
const Scroll = styled.ScrollView``;

const Container = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
  padding-top: 50px;
  background-color: #ffffff;
`;

const Logo = styled.View`
  position: absolute;
  left: 35px;
  top: 85px;
  z-index: 99;
`;

const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const FormContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 50px 35px;
  padding-bottom: 85px;
  background-color: #ffffff;
  border-radius: 15px;
`;

const Form = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 25px;
  margin-bottom: 20px;
`;

const TitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const InputContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  padding: 0px 0px;
  background-color: inherit;
  gap: 25px;
`;

const InputWrapper = styled.View`
  align-items: center;
  width: 100%;
  height: 80px;
`;

const Label = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 18px;
  margin-bottom: 10px;
`;

const LabelText = styled.Text`
  color: #2d3748;
  font-size: 12px;
  font-weight: 600;
`;

const LabelErrorText = styled.Text`
  margin-left: 10px;
  font-size: 12px;
  font-weight: 500;
  color: red;
`;

const Input = styled.TextInput<{ error?: string }>`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0px 20px;
  border: ${(props) =>
    props.error && props.error !== "" ? "1px solid red" : "1px solid #E2E8F0"};
  border-radius: 15px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #2d3748;
`;

const CheckBoxTitle = styled.View`
  width: ${Dimension.width * 0.85}px;
  height: auto;
  margin-bottom: 20px;
`;

const CheckBoxTitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #4f4f4f;
`;

const CheckBoxContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: auto;
  margin-bottom: 50px;
`;

const CheckBoxMobile = styled.View<{ select: string }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  height: 50px;
  margin-bottom: 10px;
  padding: 0px ${Dimension.width * 0.1}px;
  background-color: ${(props) =>
    props.select === "true" ? "#4f4f4f" : "#ffffff"};
  border-radius: 4px;
  border: 1px solid #4f4f4f;
`;

const CheckBoxText = styled.Text<{ select: string }>`
  color: ${(props) => (props.select === "true" ? "#ffffff" : "#4f4f4f")};
  font-size: 12px;
  font-weight: 600;
`;

const CheckBoxError = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const CheckBoxErrorText = styled.Text`
  font-weight: 500;
  font-size: 12px;
  color: red;
`;

const ButtonWrapper = styled.View`
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 45px;
  margin-bottom: 20px;
`;

const LoginButton = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #0075ff;
  border-radius: 12px;
`;

const ButtonText = styled.Text`
  font-style: normal;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;

interface EnterForm {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
}

interface EnterResponse {
  user: User;
  error?: {
    email: string;
    password: string;
    confirm_password: string;
    name: string;
  };
}

interface ErrorResponse {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
}

type SignUpScreenProps = NativeStackScreenProps<RootNavParamList, "SignUp">;

const SignUp = ({ navigation }: SignUpScreenProps) => {
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [enter, { loading, data, error, status }] = useMutation<
    EnterResponse,
    ErrorResponse
  >("https://www.bluetags.app/api/users/sign-up");
  const [auth] = useMutation("https://www.bluetags.app/api/users/sign-up/auth");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<EnterForm>();
  const [checkBoxMobile, setCheckBoxMobile] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [checkBoxError, setCheckBoxError] = useState("");

  const onNext = (nextOne: React.MutableRefObject<any>) => {
    nextOne?.current?.focus();
  };

  const emailValidation = (email: string) => {
    let regex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
    if (!regex.test(email))
      setError("email", { message: "이메일 양식 이상함" });
    return regex.test(email);
  };

  const passwordValidation = (password: string) => {
    if (password.length < 8 || password.length > 20) {
      setError("password", { message: "8자리 ~ 20자리 이내로 입력해주세요." });
      return false;
    } else if (password.search(/\s/) != -1) {
      setError("password", { message: "비밀번호는 공백 없이 입력해주세요." });
      return false;
    } else if (
      password.search(/[0-9]/g) < 0 ||
      password.search(/[a-z]/gi) < 0
    ) {
      setError("password", {
        message: "영문,숫자,특수문자를 혼합하여 입력해주세요.",
      });
      return false;
    }
    return true;
  };

  const onClickTerm = (termIndex: number) => {
    const array: boolean[] = [];
    checkBoxMobile.map((bool, index) => {
      if (index !== termIndex) {
        array.push(bool);
      } else {
        array.push(!bool);
      }
    });
    setCheckBoxMobile((prev) => [...array]);
  };

  const onValid = async (validForm: EnterForm) => {
    const validation =
      emailValidation(validForm.email) &&
      passwordValidation(validForm.password);
    if (loading) return;
    if (validation) enter({ ...validForm, key: API_KEY });
  };

  useEffect(() => {
    if (status === 200) {
      auth({ email: data?.user.email });
      navigation.navigate("Tabs", {
        screen: "Home",
        params: { screen: "Main" },
      });
    }
  }, [data, status]);

  useEffect(() => {
    register("email");
    register("name");
    register("password");
    register("confirm_password");
  }, [register]);

  useEffect(() => {
    if (error) {
      if (error.confirm_password) {
        setError("confirm_password", { message: error.confirm_password });
      }
      if (error.email) {
        setError("email", { message: error.email });
      }
      if (error.password) {
        setError("password", { message: error.password });
      }
      if (error.name) {
        setError("name", { message: error.name });
      }
    }
  }, [error, setError]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    return () => {
      navigation.setOptions({
        headerShown: true,
      });
    };
  }, []);

  return (
    <Scroll>
      <Container>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("Tabs", {
              screen: "Home",
              params: { screen: "Main" },
            });
          }}
        >
          <Logo>
            <Svg width="35" height="35" viewBox="0 0 43 56" fill="none">
              <Path
                d="M42.0994 49.8155C33.6497 41.5695 33.6497 28.2304 42.0994 19.9844L21.5964 0L0 21.0758L35.7869 56L42.0994 49.8398V49.8155Z"
                fill="#257CFF"
              />
            </Svg>
          </Logo>
        </TouchableWithoutFeedback>
        <LoginContainer>
          <FormContainer>
            <TitleContainer>
              <TitleText>Sign up</TitleText>
            </TitleContainer>
            <Form>
              <InputContainer>
                <InputWrapper>
                  <Label>
                    <LabelText>E-mail</LabelText>
                    <LabelErrorText>{errors.email?.message}</LabelErrorText>
                  </Label>
                  <Input
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholder="Email"
                    onChangeText={(text) => setValue("email", text)}
                    onSubmitEditing={() => onNext(nameRef)}
                    error={errors.email?.message}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label>
                    <LabelText>Name</LabelText>
                    <LabelErrorText>{errors.name?.message}</LabelErrorText>
                  </Label>
                  <Input
                    ref={nameRef}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholder="Name"
                    onChangeText={(text) => setValue("name", text)}
                    onSubmitEditing={() => onNext(passwordRef)}
                    error={errors.name?.message}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label>
                    <LabelText>Password</LabelText>
                    <LabelErrorText>{errors.password?.message}</LabelErrorText>
                  </Label>
                  <Input
                    ref={passwordRef}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholder="Password"
                    onChangeText={(text) => setValue("password", text)}
                    onSubmitEditing={() => onNext(confirmPasswordRef)}
                    error={errors.password?.message}
                    secureTextEntry={true}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label>
                    <LabelText>Confirm Password</LabelText>
                    <LabelErrorText>
                      {errors.confirm_password?.message}
                    </LabelErrorText>
                  </Label>
                  <Input
                    ref={confirmPasswordRef}
                    autoCapitalize="none"
                    returnKeyType="next"
                    placeholder="Confirm Password"
                    onChangeText={(text) => setValue("confirm_password", text)}
                    onSubmitEditing={handleSubmit(onValid)}
                    error={errors.confirm_password?.message}
                    secureTextEntry={true}
                  />
                </InputWrapper>
              </InputContainer>
              <CheckBoxContainer>
                <CheckBoxTitle>
                  <CheckBoxTitleText>
                    Terms of collection of non-member information
                  </CheckBoxTitleText>
                </CheckBoxTitle>
                <TouchableWithoutFeedback onPress={() => onClickTerm(0)}>
                  <CheckBoxMobile select={String(checkBoxMobile[0])}>
                    <CheckBoxText select={String(checkBoxMobile[0])}>
                      Option A agreement
                    </CheckBoxText>
                    <CheckBoxText select={String(checkBoxMobile[0])}>
                      {checkBoxMobile[0] ? (
                        <Svg
                          width="24"
                          height="14"
                          viewBox="0 0 24 14"
                          fill="none"
                        >
                          <Path
                            d="M17.8351 1.41L16.4333 0L10.1299 6.34L11.5318 7.75L17.8351 1.41ZM22.0506 0L11.5318 10.58L7.37594 6.41L5.97409 7.82L11.5318 13.41L23.4624 1.41L22.0506 0ZM0.346802 7.82L5.9045 13.41L7.30635 12L1.7586 6.41L0.346802 7.82Z"
                            fill="white"
                          />
                        </Svg>
                      ) : (
                        `(see details)`
                      )}
                    </CheckBoxText>
                  </CheckBoxMobile>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => onClickTerm(1)}>
                  <CheckBoxMobile select={String(checkBoxMobile[1])}>
                    <CheckBoxText select={String(checkBoxMobile[1])}>
                      Option A agreement
                    </CheckBoxText>
                    <CheckBoxText select={String(checkBoxMobile[1])}>
                      {checkBoxMobile[1] ? (
                        <Svg
                          width="24"
                          height="14"
                          viewBox="0 0 24 14"
                          fill="none"
                        >
                          <Path
                            d="M17.8351 1.41L16.4333 0L10.1299 6.34L11.5318 7.75L17.8351 1.41ZM22.0506 0L11.5318 10.58L7.37594 6.41L5.97409 7.82L11.5318 13.41L23.4624 1.41L22.0506 0ZM0.346802 7.82L5.9045 13.41L7.30635 12L1.7586 6.41L0.346802 7.82Z"
                            fill="white"
                          />
                        </Svg>
                      ) : (
                        `(see details)`
                      )}
                    </CheckBoxText>
                  </CheckBoxMobile>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => onClickTerm(2)}>
                  <CheckBoxMobile select={String(checkBoxMobile[2])}>
                    <CheckBoxText select={String(checkBoxMobile[2])}>
                      Option A agreement
                    </CheckBoxText>
                    <CheckBoxText select={String(checkBoxMobile[2])}>
                      {checkBoxMobile[2] ? (
                        <Svg
                          width="24"
                          height="14"
                          viewBox="0 0 24 14"
                          fill="none"
                        >
                          <Path
                            d="M17.8351 1.41L16.4333 0L10.1299 6.34L11.5318 7.75L17.8351 1.41ZM22.0506 0L11.5318 10.58L7.37594 6.41L5.97409 7.82L11.5318 13.41L23.4624 1.41L22.0506 0ZM0.346802 7.82L5.9045 13.41L7.30635 12L1.7586 6.41L0.346802 7.82Z"
                            fill="white"
                          />
                        </Svg>
                      ) : (
                        `(see details)`
                      )}
                    </CheckBoxText>
                  </CheckBoxMobile>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => onClickTerm(3)}>
                  <CheckBoxMobile select={String(checkBoxMobile[3])}>
                    <CheckBoxText select={String(checkBoxMobile[3])}>
                      Option A agreement
                    </CheckBoxText>
                    <CheckBoxText select={String(checkBoxMobile[3])}>
                      {checkBoxMobile[3] ? (
                        <Svg
                          width="24"
                          height="14"
                          viewBox="0 0 24 14"
                          fill="none"
                        >
                          <Path
                            d="M17.8351 1.41L16.4333 0L10.1299 6.34L11.5318 7.75L17.8351 1.41ZM22.0506 0L11.5318 10.58L7.37594 6.41L5.97409 7.82L11.5318 13.41L23.4624 1.41L22.0506 0ZM0.346802 7.82L5.9045 13.41L7.30635 12L1.7586 6.41L0.346802 7.82Z"
                            fill="white"
                          />
                        </Svg>
                      ) : (
                        `(see details)`
                      )}
                    </CheckBoxText>
                  </CheckBoxMobile>
                </TouchableWithoutFeedback>
                <CheckBoxError>
                  <CheckBoxErrorText>{checkBoxError}</CheckBoxErrorText>
                </CheckBoxError>
              </CheckBoxContainer>
              <ButtonWrapper>
                <TouchableWithoutFeedback onPress={handleSubmit(onValid)}>
                  <LoginButton>
                    <ButtonText>Create Account</ButtonText>
                  </LoginButton>
                </TouchableWithoutFeedback>
              </ButtonWrapper>
            </Form>
          </FormContainer>
        </LoginContainer>
      </Container>
    </Scroll>
  );
};

export default SignUp;
