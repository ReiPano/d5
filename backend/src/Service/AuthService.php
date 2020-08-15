<?php


namespace App\Service;


use App\Repository\UserRepository;
use App\ViewModels\ServiceResponse;
use Exception;

class AuthService
{
    public function authenticateUserByUsernameAndToken($username, $token, $registry) {
        try {

            if (!is_null($username) && !is_null($token)) {
                $userRepository = new UserRepository($registry);
                $user = $userRepository->findOneBy(["username"=>$username, "token"=>$token]);
                if (!is_null($user)) {
                    $dateUpdated = $user->getDateUpdated();
                    $timeNow = new \DateTime();
                    $diff = $dateUpdated->diff($timeNow);
                    if (is_null($dateUpdated) || ($diff && $diff->i < 30)) {
                        $result = new ServiceResponse(true, $user, "Success");
                    }
                    else {
                        $result = new ServiceResponse(false, null, "Token is not valid");
                    }
                }
                else {
                    $result = new ServiceResponse(false, null, "Username or token not correct");
                }
            }
            else {
                $result = new ServiceResponse(false, null, 'Error! Username or token not correprovidedct');
            }
        }
        catch (Exception $e) {
            $result = new ServiceResponse(false, null, $e->getMessage());
        }
        return $result;
    }
}