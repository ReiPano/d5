<?php


namespace App\ViewModels;


class ServiceResponse
{
    protected $success;
    protected $response;
    protected $message;

    public function __construct($success, $response, $message)
    {
        $this->success = $success;
        $this->response = $response;
        $this->message = $message;
    }
}