<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class PortfolioContentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $broadcastQueue = 'default';

    public function __construct(
        public readonly string $scope,
        public readonly string $updatedAt,
    ) {}

    /**
     * @return list<Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('portfolio.telemetry'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'content.updated';
    }

    /**
     * @return array<string, string>
     */
    public function broadcastWith(): array
    {
        return [
            'scope' => $this->scope,
            'updatedAt' => $this->updatedAt,
        ];
    }
}
