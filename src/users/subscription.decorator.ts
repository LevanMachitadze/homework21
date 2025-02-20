import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Subscription = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.subscription, 'reques.subsiption');
    return request.subscription;
  },
);
