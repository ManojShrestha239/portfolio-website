@extends('errors.layout')

@section('code', '503')
@section('title', 'Service Unavailable')
@section('message', 'The portfolio is temporarily offline for scheduled maintenance or deployment.')
@section('diagnostic', 'MAINTENANCE_MODE_ACTIVE · ZERO_DATA_LOSS')
