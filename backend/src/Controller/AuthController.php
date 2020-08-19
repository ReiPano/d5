<?php


namespace App\Controller;


use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\AuthService;
use App\Service\FileUploadService;
use App\Service\SerializerService;
use App\Service\TokenService;
use App\ViewModels\ServiceResponse;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Zumba\JsonSerializer\JsonSerializer;

class AuthController extends AbstractController
{
    /**
     * @Route("/auth/login")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param TokenService $tokenService
     * @return Response
     */
    public function login(Request $request, SerializerService $serializerService, TokenService $tokenService) {
        $result = null;

        $username = $request->request->get('username');
        $password = $request->request->get('password');

        if (!is_null($username) && !is_null($password)) {
            $userRepository = new UserRepository($this->getDoctrine());
            $user = $userRepository->findOneBy(["username"=>$username]);
            if (!is_null($user)) {
                $userPassword = $user->getPassword();
                if (password_verify($password, $userPassword)) {
                    $token = $tokenService->generateToken();
                    $user->setToken($token);
                    $user->setDateUpdated(date_create());
                    $this->getDoctrine()->getManager()->persist($user);
                    $this->getDoctrine()->getManager()->flush();
                    $result = new ServiceResponse(true, $user, "Success");
                }
                else {
                    $result = new ServiceResponse(false, null, "Error! Password not correct");
                }
            }
            else {
                $result = new ServiceResponse(false, null, "Error! User not found");
            }
        }
        else {
            $result = new ServiceResponse(false, null, "Error! Username or password not correct");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }

    /**
     * @Route("/auth/token-authentication")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param AuthService $authService
     * @return Response
     */
    public function tokenAuthentication(Request $request, SerializerService $serializerService, AuthService $authService) {
        $username = $request->request->get('username');
        $token = $request->request->get('token');
        $result = $authService->authenticateUserByUsernameAndToken($username, $token, $this->getDoctrine());
        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }

    /**
     * @Route("/auth/register")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param FileUploadService $fileUploadService
     * @return Response
     */
    public function register(Request $request, SerializerService $serializerService, FileUploadService $fileUploadService) {
        $result = null;
        $username = $request->request->get("username");
        $password = $request->request->get("password");
        $reEnteredPassword = $request->request->get("reEnteredPassword");
        $email = $request->request->get("email");
//        $profilePicture = $request->request->get('profilePicture');
//        $backgroundImage = $request->request->get('backgroundImage');

        if (!is_null($username) && !is_null($password) && !is_null($reEnteredPassword) && !is_null($email)) {
            if ($password == $reEnteredPassword) {
                $entityManager = $this->getDoctrine()->getManager();
                $userRepository = new UserRepository($this->getDoctrine());
                $existingUser = $userRepository->findOneBy(["username"=>$username]);
                if (is_null($existingUser)) {
                    $existingUser = $userRepository->findOneBy(["email"=> $email]);
                    if (is_null($existingUser)) {
                        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                        $user = new User();
                        $user->setUsername($username);
                        $user->setPassword($passwordHash);
                        $user->setEmail($email);
                        $user->setDeleted(false);
                        $user->setProfilePicture($this->getParameter("profile_image"));
                        $user->setBackgroundImage($this->getParameter("background_image"));
                        $user->setDateCreated(date_create());
                        try {
                            $entityManager->persist($user);
                            $entityManager->flush();
                            $result = new ServiceResponse(true, null, "Success");
                        } catch (Exception $e) {
                            $result = new ServiceResponse(false, null, "User could not be created");
                        }
                    }
                    else {
                        $result = new ServiceResponse(false, null, "Email is already being used. Please try another one");
                    }
                }
                else {
                    $result = new ServiceResponse(false, null, "Username is already being used. Please try another one");
                }
            }
            else {
                $result = new ServiceResponse(false, null, "Error! Passwords did not match");
            }
        }
        else {
            $result = new ServiceResponse(false, null, "Error! Not all information was provided");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }


    /**
     * @Route("/auth/update-user")
     * @param Request $request
     * @param SerializerService $serializerService
     * @return Response
     */
    public function updateUser(Request $request, SerializerService $serializerService) {
        $result = null;
        $username = $request->request->get("username");
        $profilePicture = $request->request->get("profilePicture");
        $backgroundImage = $request->request->get("backgroundImage");

        $userRepository = new UserRepository($this->getDoctrine());
        $user = $userRepository->findOneBy(array("username"=>$username));
        if (!is_null($user)) {
            $user->setProfilePicture($profilePicture);
            $user->setBackgroundImage($backgroundImage);
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
            $result = new ServiceResponse(true, $user, "Success");
        }
        else {
            $result = new ServiceResponse(false, null, "Error! User not found");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }

    /**
     * @Route("/auth/logout")
     * @param Request $request
     * @param SerializerService $serializerService
     * @return Response
     */
    public function logout(Request $request, SerializerService $serializerService) {
        $result = null;
        $username = $request->request->get("username");
        $userRepository = new UserRepository($this->getDoctrine());
        if (!is_null($username)) {
            $user = $userRepository->findOneBy(array("username"=>$username));
            if (!is_null($user)) {
                $user->setToken(null);
                $this->getDoctrine()->getManager()->persist($user);
                $this->getDoctrine()->getManager()->flush();
                $result = new ServiceResponse(true, null, "Success");
            }
            else {
                $result = new ServiceResponse(false, null, "Error! User not found");
            }
        }
        else {
            $result = new ServiceResponse(false, null, "Error! Username is empty");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }
}