@extends('errors.layout')

@section('code', '404')
@section('title', 'Route Not Found')
@section('message', 'The requested document, case study, or endpoint does not exist on this host.')
@section('diagnostic', 'HTTP_404_UNRESOLVED · VERIFY_SLUG_OR_INDEX')
