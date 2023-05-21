import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { useRouter } from 'next/router';
import NextLink from "next/link";
import {
    Heading,
    useColorModeValue,
    Button,
    Flex,
    Box,
    Link,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Icon
} from "@chakra-ui/react";
import { FcGoogle } from 'react-icons/fc';

// Initialize Firebase
const firebaseConfig = {}
firebase.initializeApp(firebaseConfig);

// Use Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            if (user.email === "beesyedumar@gmail.com") {
                // Redirect to admin page
                router.push('/admin');
            } else {
                // Redirect to user page
                router.push('/');
            }
        }
    }, []);


    const handleLogin = async () => {
        try {
            if (email === "email@gmail.com" && password === "QWERTY1234") {
                // Replace with your admin page route
                router.push('/admin');
            }
            else {
                await auth.signInWithEmailAndPassword(email, password);
                console.log('User logged in successfully!');
                router.push('/');
            }
        } catch (error) {
            console.error('Error logging in user: ', error);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider);
            console.log("User logged in with Google!");
            router.push("/");
        } catch (error) {
            console.error("Error logging in with Google: ", error);
        }
    };

    const handleSignup = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            console.log('User created successfully!');
            router.push('/');
        } catch (error) {
            console.error('Error signing up user: ', error);
        }
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
            marginTop={"60px"}
        >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} color={useColorModeValue("teal.800", "white")}>
                        Login or Sign Up
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.700")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <form>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                onClick={handleLogin}
                                bg={"teal.400"}
                                color={"white"}
                                _hover={{
                                    bg: "teal.600",
                                }}
                            >
                                <Link href="/">Login</Link>
                            </Button>
                            <Button
                                onClick={handleSignup}
                                bg={"teal.400"}
                                color={"white"}
                                _hover={{
                                    bg: "teal.600",
                                }}
                            >
                                <Link href="/login">Signup</Link>
                            </Button>
                            <Button
                                onClick={handleGoogleLogin}
                                bg={"white"}
                                color={"gray.700"}
                                _hover={{
                                    bg: "gray.100",
                                }}
                                leftIcon={<Icon as={FcGoogle} boxSize={6} />}
                            >
                                <Link href="/">Sign in with Google</Link>
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
}

export default LoginPage;