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
  justify-content: flex-start;
  align-items: center;
  width: ${Dimension.width}px;
  height: ${Dimension.height}px;
  padding-top: 30px;
  padding-left: 0px;
  overflow-x: hidden;
`;

const InfographicContainer = styled.View`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width * 0.7}px;
  height: ${Dimension.height * 0.35}px;
  min-height: 280px;
  margin: 30px 0px;
  border-radius: 20px;
  overflow: hidden;
`;

const Infographic = styled.Image`
  width: 100%;
  height: 100%;
`;

const LoginContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 50px;
`;

const FormContainer = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Form = styled.View`
  justify-content: center;
  align-items: center;
  width: 20px;
`;

const InputContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  height: auto;
  margin-bottom: 20px;
  padding: 0px 0px;
  background-color: inherit;
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
  color: #4f4f4f;
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
  width: 100%;
  height: 40px;
  padding-left: 15px;
  border: ${(props) =>
    props.error && props.error !== "" ? "1px solid red" : "1px solid #4f4f4f"};
  border-radius: 4px;
  font-size: 14px;
`;

const SocialLoginContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  height: auto;
  margin-bottom: 30px;
`;

const SocialLogin = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #4f4f4f;
`;

const SocialLoginText = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const ButtonWrapper = styled.View`
  justify-content: center;
  align-items: flex-end;
  width: ${Dimension.width * 0.85}px;
  height: 40px;
  margin-bottom: 10px;
`;

const LoginButton = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #0075ff;
  border-radius: 4px;
`;

const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;

const LinkBox = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: ${Dimension.width * 0.85}px;
  margin-bottom: 20px;
`;

const LinkBoxText = styled.Text`
  font-weight: 600;
  color: black;
  font-size: 16px;
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
    expoClientId:
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
          <InfographicContainer>
            <Infographic source={require(".././../assets/logo.png")} />
          </InfographicContainer>
        </TouchableWithoutFeedback>
        <LoginContainer>
          <FormContainer>
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
              <TouchableWithoutFeedback
                disabled={!request}
                onPress={() => {
                  promptAsync({ showInRecents: true });
                }}
              >
                <SocialLoginContainer>
                  <SocialLogin>
                    <SocialLoginText>Sign in with google</SocialLoginText>
                    <Svg
                      style={{ marginLeft: 10 }}
                      width="20"
                      height="20"
                      viewBox="0 0 14 15"
                      fill="none"
                    >
                      <G clipPath="url(#clip0_684_5624)">
                        <Path
                          d="M13.9935 7.29848C13.9935 6.71146 13.9459 6.28309 13.8428 5.83887H7.13965V8.48837H11.0742C10.995 9.1468 10.5666 10.1384 9.61464 10.8047L9.6013 10.8934L11.7207 12.5353L11.8675 12.55C13.2161 11.3045 13.9935 9.47203 13.9935 7.29848Z"
                          fill="#4285F4"
                        />
                        <Path
                          d="M7.13965 14.2792C9.06727 14.2792 10.6855 13.6445 11.8675 12.5499L9.61464 10.8046C9.01177 11.225 8.20261 11.5186 7.13965 11.5186C5.25167 11.5186 3.64927 10.2732 3.07806 8.55176L2.99434 8.55887L0.790539 10.2644L0.761719 10.3445C1.93575 12.6767 4.3473 14.2792 7.13965 14.2792Z"
                          fill="#34A853"
                        />
                        <Path
                          d="M3.07787 8.55102C2.92715 8.1068 2.83992 7.6308 2.83992 7.13899C2.83992 6.64713 2.92715 6.17119 3.06994 5.72696L3.06595 5.63235L0.834531 3.89941L0.761523 3.93414C0.277648 4.90195 0 5.98875 0 7.13899C0 8.28924 0.277648 9.37598 0.761523 10.3438L3.07787 8.55102Z"
                          fill="#FBBC05"
                        />
                        <Path
                          d="M7.13965 2.76057C8.48026 2.76057 9.38457 3.33966 9.90022 3.82359L11.9151 1.85626C10.6777 0.706016 9.06727 0 7.13965 0C4.3473 0 1.93575 1.6024 0.761719 3.9346L3.07013 5.72742C3.64927 4.00602 5.25167 2.76057 7.13965 2.76057Z"
                          fill="#EB4335"
                        />
                      </G>
                      <Defs>
                        <ClipPath id="clip0_684_5624">
                          <Rect width="14" height="14.3281" fill="white" />
                        </ClipPath>
                      </Defs>
                    </Svg>
                  </SocialLogin>
                </SocialLoginContainer>
              </TouchableWithoutFeedback>
              <ButtonWrapper>
                <TouchableWithoutFeedback onPress={handleSubmit(onValid)}>
                  <LoginButton>
                    <ButtonText>Login</ButtonText>
                  </LoginButton>
                </TouchableWithoutFeedback>
              </ButtonWrapper>
              <LinkBox>
                <LinkBoxText>Forgot your password ?</LinkBoxText>
              </LinkBox>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
              >
                <SignUp>
                  <SignUpText>Sign up</SignUpText>
                </SignUp>
              </TouchableWithoutFeedback>
            </Form>
          </FormContainer>
        </LoginContainer>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
