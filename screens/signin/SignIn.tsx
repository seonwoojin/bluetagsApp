import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { TouchableWithoutFeedback } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavParamList } from "../../navigation/Root";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { User } from "../../libs/schema";
import useMutation from "../../libs/useMutation";
import { API_KEY } from "react-native-dotenv";
import { useUser } from "../../libs/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import onNext from "../../libs/nextRef";

WebBrowser.maybeCompleteAuthSession();

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

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 25px;
  margin-bottom: 20px;
`;

const TitleContainerText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const SocialLoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  height: auto;
  margin-bottom: 20px;
`;

const SocialLogin = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 75px;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
`;

const OrDiv = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const OrDivText = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: #a0aec0;
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

const LinkWrapper = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: auto;
`;

const LinkBox = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: auto;
  margin-bottom: 20px;
  gap: 10px;
`;

const LinkBoxTextFirst = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #a0aec0;
`;

const LinkBoxTextSecond = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #257cff;
`;

const SignUp = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  height: 40px;
  border: 1px solid #3733ff;
  background-color: #ffffff;
  border-radius: 4px;
`;

const SignUpText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #3733ff;
`;

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface SocialLoginResponse {
  user: User;
  token: string;
}

type SignInScreenProps = NativeStackScreenProps<RootNavParamList, "SignIn">;

const SignIn = ({ navigation }: SignInScreenProps) => {
  const { user, setUser } = useUser();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "136242208106-3nsqr0dhco6uu97chrr4d96ebnb8gb39.apps.googleusercontent.com",
    clientId:
      "136242208106-khf9h80bovft9njgurt3p8l2v7js6ive.apps.googleusercontent.com",
  });
  const [login, { loading, data, error, status }] = useMutation<LoginResponse>(
    "https://www.bluetags.app/api/users/sign-in/mobile"
  );
  const [
    socialLogin,
    {
      loading: socialLoading,
      data: socialData,
      error: socialError,
      status: socialStatus,
    },
  ] = useMutation<SocialLoginResponse>(
    "https://www.bluetags.app/api/users/sign-in/social/mobile"
  );
  const [socialObj, setSocailObj] = useState<any>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<LoginForm>();
  const passwordRef = useRef(null);

  const getUserInfo = async (token: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setSocailObj(user);
    } catch (error) {}
  };
  const emailValidation = (email: string) => {
    let regex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
    if (!regex.test(email))
      setError("email", { message: "이메일 양식 이상함" });
    return regex.test(email);
  };
  const onValid = (data: LoginForm) => {
    if (loading) return;
    if (emailValidation(data.email)) {
      login({ ...data, key: API_KEY });
    }
  };

  useEffect(() => {
    if (socialObj && !socialLoading) {
      const body = {
        email: socialObj.email,
        name: socialObj.name,
        image: socialObj.picture,
      };
      socialLogin(body);
    }
  }, [socialObj]);

  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication!.accessToken);
    }
  }, [response]);

  useEffect(() => {
    register("email");
    register("password");
  }, [register]);

  useEffect(() => {
    const storeToken = async (value: string) => {
      try {
        await AsyncStorage.setItem("token", value);
      } catch (e) {}
    };
    if (data) {
      if (!data?.user.auth) {
        console.log("Auth");
      } else if (status === 200) {
        storeToken(data.token);
        setUser(data.user);
        navigation.navigate("Tabs", {
          screen: "Home",
          params: { screen: "Main" },
        });
      }
    }
  }, [data, status]);

  useEffect(() => {
    const storeToken = async (value: string) => {
      try {
        await AsyncStorage.setItem("token", value);
      } catch (e) {}
    };
    if (socialStatus === 200 && socialData) {
      storeToken(socialData.token);
      setUser(socialData.user);
      navigation.navigate("Tabs", {
        screen: "Home",
        params: { screen: "Main" },
      });
    }
  }, [socialStatus, socialData]);

  useEffect(() => {
    if (error && error.includes("account")) {
      setError("email", { message: error });
    } else if (error && error.includes("password")) {
      setError("password", { message: error });
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
    <KeyboardAwareScrollView>
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
              <TitleContainerText>Sign in with</TitleContainerText>
            </TitleContainer>
            <TouchableWithoutFeedback
              disabled={!request}
              onPress={() => {
                promptAsync({ showInRecents: true });
              }}
            >
              <SocialLoginContainer>
                <SocialLogin>
                  <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <Path
                      d="M22.6794 10.8819L22.5734 10.4323H12.8028V14.5677H18.6406C18.0345 17.4458 15.222 18.9608 12.9247 18.9608C11.2531 18.9608 9.49109 18.2577 8.32484 17.1275C7.70953 16.5217 7.21974 15.8005 6.88353 15.0051C6.54731 14.2098 6.37126 13.356 6.36547 12.4925C6.36547 10.7506 7.14828 9.00828 8.28734 7.86219C9.4264 6.71609 11.1467 6.07484 12.8572 6.07484C14.8161 6.07484 16.22 7.115 16.745 7.58937L19.6836 4.66625C18.8216 3.90875 16.4534 2 12.7625 2C9.91484 2 7.18437 3.09078 5.18844 5.08015C3.21875 7.03906 2.19922 9.87172 2.19922 12.5C2.19922 15.1283 3.16391 17.8194 5.07266 19.7937C7.11219 21.8994 10.0006 23 12.9748 23C15.6809 23 18.2459 21.9397 20.0741 20.0159C21.8712 18.1222 22.8008 15.5019 22.8008 12.755C22.8008 11.5986 22.6845 10.9119 22.6794 10.8819Z"
                      fill="#2D3748"
                    />
                  </Svg>
                </SocialLogin>
              </SocialLoginContainer>
            </TouchableWithoutFeedback>
            <OrDiv>
              <OrDivText>or</OrDivText>
            </OrDiv>
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
                    onSubmitEditing={() => onNext(passwordRef)}
                    error={errors.email?.message}
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
                    secureTextEntry={true}
                    onChangeText={(text) => setValue("password", text)}
                    onSubmitEditing={handleSubmit(onValid)}
                    error={errors.password?.message}
                  />
                </InputWrapper>
              </InputContainer>
              <ButtonWrapper>
                <TouchableWithoutFeedback onPress={handleSubmit(onValid)}>
                  <LoginButton>
                    <ButtonText>SIGN IN</ButtonText>
                  </LoginButton>
                </TouchableWithoutFeedback>
              </ButtonWrapper>
              <LinkWrapper>
                <LinkBox>
                  <LinkBoxTextFirst>
                    Dont{"'"}t have an account ?
                  </LinkBoxTextFirst>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <LinkBoxTextSecond>Sign up</LinkBoxTextSecond>
                  </TouchableWithoutFeedback>
                </LinkBox>
                <LinkBox>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <LinkBoxTextSecond>
                      Forgot your password ?
                    </LinkBoxTextSecond>
                  </TouchableWithoutFeedback>
                </LinkBox>
              </LinkWrapper>
            </Form>
          </FormContainer>
        </LoginContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
