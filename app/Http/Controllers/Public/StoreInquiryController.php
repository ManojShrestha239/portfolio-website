<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Actions\Public\SubmitInquiryAction;
use App\Http\Requests\Public\StoreInquiryRequest;
use Illuminate\Http\RedirectResponse;

final class StoreInquiryController
{
    public function __invoke(
        StoreInquiryRequest $request,
        SubmitInquiryAction $action,
    ): RedirectResponse {
        $action->execute($request->validated(), $request->ip());

        return back()->with(
            'success',
            'Scope brief received. Manoj will review your requirements and respond directly.',
        );
    }
}
