import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMock = vi.hoisted(() => {
  const getUserMock = vi.fn();
  const maybeSingleMock = vi.fn();
  const eqMock = vi.fn(() => ({ maybeSingle: maybeSingleMock }));
  const selectForQueryMock = vi.fn(() => ({ eq: eqMock }));

  const singleMock = vi.fn();
  const selectForInsertMock = vi.fn(() => ({ single: singleMock }));
  const insertMock = vi.fn(() => ({ select: selectForInsertMock }));

  const fromMock = vi.fn(() => ({
    select: selectForQueryMock,
    insert: insertMock
  }));

  return {
    auth: {
      getUser: getUserMock
    },
    from: fromMock,
    __mocks: {
      getUserMock,
      maybeSingleMock,
      eqMock,
      selectForQueryMock,
      singleMock,
      selectForInsertMock,
      insertMock,
      fromMock
    }
  };
});

vi.mock("./supabase", () => ({
  supabase: supabaseMock
}));

import {
  bootstrapWorkspaceSettings,
  DEFAULT_WORKSPACE_CURRENCY,
  DEFAULT_WORKSPACE_NAME,
  type WorkspaceSettingsRow
} from "./workspaceSettings";

const mocks = supabaseMock.__mocks;

describe("bootstrapWorkspaceSettings", () => {
  beforeEach(() => {
    mocks.getUserMock.mockReset();
    mocks.maybeSingleMock.mockReset();
    mocks.eqMock.mockClear();
    mocks.selectForQueryMock.mockClear();
    mocks.singleMock.mockReset();
    mocks.selectForInsertMock.mockClear();
    mocks.insertMock.mockClear();
    mocks.fromMock.mockClear();
  });

  it("returns a controlled unauthenticated result when no user is logged in", async () => {
    mocks.getUserMock.mockResolvedValue({
      data: { user: null },
      error: null
    });

    const result = await bootstrapWorkspaceSettings();

    expect(result).toEqual({ status: "unauthenticated", data: null });
    expect(mocks.fromMock).not.toHaveBeenCalled();
  });

  it("returns existing workspace settings without creating duplicates", async () => {
    const existingRow: WorkspaceSettingsRow = {
      id: "settings-1",
      user_id: "user-1",
      workspace_name: "Existing Workspace",
      preferred_currency: "TWD",
      created_at: "2026-05-14T00:00:00.000Z",
      updated_at: "2026-05-14T00:00:00.000Z"
    };

    mocks.getUserMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null
    });
    mocks.maybeSingleMock.mockResolvedValue({
      data: existingRow,
      error: null
    });

    const result = await bootstrapWorkspaceSettings();

    expect(result).toEqual({
      status: "existing",
      data: existingRow
    });
    expect(mocks.eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(mocks.insertMock).not.toHaveBeenCalled();
  });

  it("creates default workspace settings when missing", async () => {
    const createdRow: WorkspaceSettingsRow = {
      id: "settings-2",
      user_id: "user-2",
      workspace_name: DEFAULT_WORKSPACE_NAME,
      preferred_currency: DEFAULT_WORKSPACE_CURRENCY,
      created_at: "2026-05-14T00:00:00.000Z",
      updated_at: "2026-05-14T00:00:00.000Z"
    };

    mocks.getUserMock.mockResolvedValue({
      data: { user: { id: "user-2" } },
      error: null
    });
    mocks.maybeSingleMock.mockResolvedValue({
      data: null,
      error: null
    });
    mocks.singleMock.mockResolvedValue({
      data: createdRow,
      error: null
    });

    const result = await bootstrapWorkspaceSettings();

    expect(mocks.insertMock).toHaveBeenCalledWith({
      user_id: "user-2",
      workspace_name: DEFAULT_WORKSPACE_NAME,
      preferred_currency: DEFAULT_WORKSPACE_CURRENCY
    });
    expect(result).toEqual({
      status: "created",
      data: createdRow
    });
  });
});
