@extends('errors.layout')

@section('code', '502')
@section('title', 'Bad Gateway')
@section('message', 'The upstream PHP-FPM application runtime returned an invalid response.')
@section('diagnostic', 'UPSTREAM_GATEWAY_FAULT · RETRY_SHORTLY')
