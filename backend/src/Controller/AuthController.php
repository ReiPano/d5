<?php


namespace App\Controller;


use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\SerializerService;
use App\ViewModels\ServiceResponse;
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
     * @return Response
     */
    public function login(Request $request, SerializerService $serializerService) {
        $result = null;

        $username = $request->request->get('username');
        $password = $request->request->get('password');

        if (!is_null($username) && !is_null($password)) {
            $userRepository = new UserRepository($this->getDoctrine());
            $user = $userRepository->findOneBy(["username"=>$username]);
            if (!is_null($user)) {
                $userPassword = $user->getPassword();
                if (password_verify($password, $userPassword)) {
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
     * @Route("/auth/register")
     * @param Request $request
     * @param SerializerService $serializerService
     * @return Response
     */
    public function register(Request $request, SerializerService $serializerService) {
        $result = null;

        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $reEnteredPassword = $request->request->get('reEnteredPassword');
        $email = $request->request->get('email');

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
                        $user->setDateCreated(date_create());
                        try {
                            $entityManager->persist($user);
                            $entityManager->flush();
                            $result = new ServiceResponse(true, null, "Success");
                        } catch (\Exception $e) {
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
                $result = new ServiceResponse(false, null, "Passwords did not match");
            }
        }
        else {
            $result = new ServiceResponse(false, null, "Not all information was provided");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }
}