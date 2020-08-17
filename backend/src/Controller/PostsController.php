<?php


namespace App\Controller;


use App\Entity\Attachment;
use App\Entity\Story;
use App\Entity\User;
use App\Repository\StoryRepository;
use App\Repository\UserRepository;
use App\Service\AuthService;
use App\Service\FileUploadService;
use App\Service\SerializerService;
use App\Service\TokenService;
use App\ViewModels\ServiceResponse;
use Doctrine\Common\Proxy\Proxy;
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
     * @param AuthService $authService
     * @return Response
     */
    public function getPostsForUser(Request $request, SerializerService $serializerService, AuthService $authService) {
        $result = null;
        $username = $request->query->get('username');
        $token = $request->query->get('token');

        $authResult = $authService->authenticateUserByUsernameAndToken($username, $token, $this->getDoctrine());
        if ($authResult->getSuccess()) {
            $userRepository = new UserRepository($this->getDoctrine());
            $user = $userRepository->findOneBy(array("username"=>$username, "token"=>$token));
            if ($user) {
                $userStories = $user->getStories() ? $user->getStories()->getValues() : [];
                $jsonUserStories = [];
                foreach ($userStories as $userStory) {
                    if ($userStory instanceof Story) {
                        $attachments = $userStory->getAttachments()->getValues();
                        array_push($jsonUserStories, $serializerService->jsonSerialize($userStory));
                    }
                }
                $result = new ServiceResponse(true, $jsonUserStories, "Success");
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

    /**
     * @Route("/posts/get-other-posts")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param AuthService $authService
     * @return Response
     */
    public function getOtherUserPosts(Request $request, SerializerService $serializerService, AuthService $authService) {
        $result = null;
        $username = $request->query->get('username');
        $token = $request->query->get('token');

        $authResult = $authService->authenticateUserByUsernameAndToken($username, $token, $this->getDoctrine());
        if ($authResult->getSuccess()) {
            $userRepository = new UserRepository($this->getDoctrine());
            $user = $userRepository->findOneBy(array("username"=>$username, "token"=>$token));
            if ($user) {
                $storyRepository = new StoryRepository($this->getDoctrine());
                $query = $storyRepository->createQueryBuilder('s');
                $query->where("s.user != :userId")->setParameter("userId", $user->getId());
                $query->orderBy("s.dateCreated", "desc");
                $otherStories = $query->getQuery()->getResult();
                $jsonOtherStories = [];
                foreach ($otherStories as $otherStory) {
                    if ($otherStory instanceof Story) {
                        $attachments = $otherStory->getAttachments()->getValues();
                        $otherUser = $otherStory->getUser();
                        $newOtherUser = new User();
                        $newOtherUser->setUsername($otherUser->getUsername());
                        $newOtherUser->setProfilePicture($otherUser->getProfilePicture());
                        $newOtherUser->setBackgroundImage($otherUser->getBackgroundImage());
                        $otherStory->setUser($newOtherUser);
                        array_push($jsonOtherStories, $serializerService->jsonSerialize($otherStory));
                    }
                }
                $result = new ServiceResponse(true, $jsonOtherStories, "Success");
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

    /**
     * @Route("/posts/add-post")
     * @param Request $request
     * @param SerializerService $serializerService
     * @param FileUploadService $fileUploadService
     * @return Response
     */
    public function addNewPost(Request $request, SerializerService $serializerService, FileUploadService $fileUploadService) {
        $result = null;

        $attachments = $request->files->get('attachments');
        $title = $request->request->get("title");
        $content = $request->request->get("content");
        $username = $request->request->get("username");

        $userRepository = new UserRepository($this->getDoctrine());
        $user = $userRepository->findOneBy(array("username"=>$username));
        if (!is_null($user) && $user instanceof User) {
            $filePath = $this->getParameter('brochures_directory') . $user->getId() . "/";
            $storyAttachments = [];
            if (!file_exists($filePath)) {
                mkdir($filePath);
            }
            foreach ($attachments as $attachment) {
                $uploadResult = $fileUploadService->upload($attachment, $filePath);
                if (!$uploadResult) {
                    $result = new ServiceResponse(false, null, "Error! Attachments could not be saved.");
                    break;
                }
                else {
                    $storyAttachment = new Attachment();
                    $storyAttachment->setFileName('uploads/'. $user->getId() . '/' .$uploadResult);
                    $storyAttachment->setDateCreated(date_create());
                    $storyAttachment->setDeleted(false);
                    array_push($storyAttachments, $storyAttachment);
                }
            }

            if (is_null($result)) {
                $story = new Story();
                $story->setUser($user);
                $story->setTitle($title);
                $story->setContent($content);
                $story->setDateCreated(date_create());
                $story->setDeleted(false);
                $this->getDoctrine()->getManager()->persist($story);
                $this->getDoctrine()->getManager()->flush();

                foreach ($storyAttachments as $storyAttachment) {
                    $storyAttachment->setStory($story);
                    $this->getDoctrine()->getManager()->persist($storyAttachment);
                    $this->getDoctrine()->getManager()->flush();
                }
                $result = new ServiceResponse(true, null, "Success");
            }
        }
        else {
            $result = new ServiceResponse(false, null, "Error! User not found.");
        }

        $response = new Response();
        $response->setContent($serializerService->jsonSerialize($result));
        return $response;
    }
}