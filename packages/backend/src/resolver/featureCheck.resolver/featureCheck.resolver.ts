import { JWT } from '@/config/jwt';
import { Request } from 'express';
import { FeatureBlock } from '@/database';

export const featureCheck = async (_: void, req: Request) => {
  console.debug('[Resolve] feature check called');
  const payload = await new JWT().authorize(req.headers.authorization);

  if (!payload || payload.type !== 'verified') {
    return null;
  }

  let { featureName } = req.query;
  if (!featureName) return null;

  try {
    let isFeatureEnabled = await FeatureBlock.findOne({
      name: featureName as string,
      users: payload.userId,
    });
    if (!isFeatureEnabled) return { status: false };
    return { status: true };
  } catch {
    return null;
  }
};
