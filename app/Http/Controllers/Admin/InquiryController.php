<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\UpdateInquiryStatusAction;
use App\Data\InquiryData;
use App\Http\Requests\Admin\UpdateInquiryStatusRequest;
use App\Models\Inquiry;
use App\Services\AdminQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InquiryController
{
    public function __construct(
        private readonly AdminQueryService $adminQuery,
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $statusFilter = is_string($status) && $status !== '' ? $status : null;

        return Inertia::render('Admin/Inquiries/Index', [
            'statusFilter' => $statusFilter,
            'inquiries' => array_map(
                static fn (InquiryData $inquiry): array => $inquiry->toArray(),
                $this->adminQuery->getInquiries($statusFilter),
            ),
        ]);
    }

    public function update(
        UpdateInquiryStatusRequest $request,
        Inquiry $inquiry,
        UpdateInquiryStatusAction $action,
    ): RedirectResponse {
        $action->execute($inquiry, $request->validated());

        return redirect()
            ->route('admin.inquiries.index')
            ->with('success', 'Inquiry status updated.');
    }
}
