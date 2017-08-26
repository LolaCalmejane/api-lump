<?php
/**
 * Created by PhpStorm.
 * User: thomas
 * Date: 02/08/2017
 * Time: 10:51
 */

require_once 'CurlTest.php';

$curl = new CurlTest();
/*
$request = $curl->init('http://localhost:3000/api/1.0/user/search', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'login' => 'tho'
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/user/create', 'POST',
    [
        'email' => 'dupont2.thomas70@gmail.com',
        'login' => 'thomas3',
        'password' => 'test'
    ])
    ->setOpt()
    ->execute();
echo $request->result;



$request = $curl->init('http://localhost:3000/api/1.0/friend/add/5981c8d13777dc60de73b26c', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/user/login/', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/friend/list/', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'ids' => ["5981bc0a95d2ef4fc943474e","5981c8d13777dc60de73b26c"]
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/friend/delete/5981bc0a95d2ef4fc943474e', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/music/search', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'search' => "rihanna diaman"
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/music/add/music', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        "videoId" => "lWA2pjMjpBs",
        "title"=>"Rihanna - Diamonds",
        "channel"=>"RihannaVEVO",
        "thumbnails" => "https://i.ytimg.com/vi/lWA2pjMjpBs/default.jpg"
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/music/playlist/create', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'name' => "test Playlist"
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/music/playlist/add', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'id' => "599842004afc9761ccc2a8c0",
        'music' => 'lWA2pjMjpBs'
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/music/playlist/list', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/event/create', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'name' => "mon event",
        'date' => "Sat Aug 19 2017 10:41:07 GMT+0200 (CEST)",
        'type' => "soirée",
        'description' => "Ma super soirée à 10 heures du matin",
        'pays' => "France",
        'adresse' => "Rue de Rivoli",
        'codePostal' => "75001",
        'duration' => 5
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/event/add', 'POST',
    [
        'authorization' => base64_encode("thomas2:test"),
        'id' => "5998570fab4d4f77dcda8880",
        'music' => 'lWA2pjMjpXX'
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/event/addParticipant', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'id' => "5998570fab4d4f77dcda8880",
        'participant' => "5981bc0a95d2ef4fc943474e"
    ])
    ->setOpt()
    ->execute();
echo $request->result;
/*
$request = $curl->init('http://localhost:3000/api/1.0/event/list', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;


$request = $curl->init('http://localhost:3000/api/1.0/event/addRanking', 'POST',
    [
        'authorization' => base64_encode("thomas2:test"),
        'id' => "5998570fab4d4f77dcda8880",
        'position' => 0,
        'ranking' => 5
    ])
    ->setOpt()
    ->execute();
echo $request->result;
*/
$request = $curl->init('http://178.62.126.60/app_dev.php/api/v1/user/register', 'POST',
    [
        'email' => "dupont.thomas70@gmail.com",
        'password' => "aaaaaaaa",
        'firstname' => 'thomas',
        'lastname' => 'dupont'
    ])
    ->setOpt()
    ->execute();
echo $request->result;