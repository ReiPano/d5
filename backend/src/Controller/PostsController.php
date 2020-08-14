<?php


namespace App\Controller;


use App\Repository\StoryRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use App\Service\SerializerService;
use App\Service\TokenService;
use App\ViewModels\ServiceResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PostsController extends AbstractController
{
    /**
     * @Route("/posts/get-posts-for-user")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param TokenService $tokenService
     * @param AuthService $authService
     * @return Response
     */
    public function getPostsForUser(Request $request, SerializerService $serializerService, TokenService $tokenService, AuthService $authService) {
        $result = null;
        $username = $request->query->get('username');
        $token = $request->query->get('token');

        $authResult = $authService->authenticateUserByUsernameAndToken($username, $token, $this->getDoctrine());
        if ($authResult->getSuccess()) {
            $userRepository = new UserRepository($this->getDoctrine());
            $user = $userRepository->findOneBy(array("username"=>$username, "token"=>$token));
            if ($user) {
                $userStories = $user->getStories() ? $user->getStories()->getValues() : [];
                $result = new ServiceResponse(true, $userStories, "Success");
            }
            else {
                $result = new ServiceResponse(false, null, "User not found");
            }
        }
        else {
            $result = $authResult;
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }
}