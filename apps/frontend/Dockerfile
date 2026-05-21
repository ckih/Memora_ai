FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter frontend build

FROM base
COPY --from=build /usr/src/app/apps/frontend/.next /usr/src/app/apps/frontend/.next
COPY --from=build /usr/src/app/apps/frontend/package.json /usr/src/app/apps/frontend/package.json
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules

WORKDIR /usr/src/app/apps/frontend
CMD ["pnpm", "start"]
