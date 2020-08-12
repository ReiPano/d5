<?php


namespace App\Service;


use Zumba\JsonSerializer\JsonSerializer;

class SerializerService
{
    private $serializer;

    public function __construct()
    {
        $this->serializer = new JsonSerializer();
    }

    public function jsonSerialize($value) {
        return $this->serializer->serialize($value);
    }
}