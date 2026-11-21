@extends('errors.layout')

@section('code', '403')
@section('title', 'Access Restricted')
@section('message', 'Owner authorization is required to access this route.')
@section('diagnostic', 'AUTH_POLICY_DENIED · SINGLE_OWNER_BOUNDARY')
