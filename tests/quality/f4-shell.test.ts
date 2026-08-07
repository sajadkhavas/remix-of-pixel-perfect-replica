import { describe, expect, test } from "bun:test";

import { DEVELOPMENT_STORE_SETTINGS_FIXTURE } from "../../src/data/fixtures/store-settings";
import { validatePublicStoreSettings } from "../../src/lib/store-settings";
import {
  getAnnouncementText,
  getConfirmedEmails,
  getConfirmedPhones,
  getConfirmedSocialLinks,
  getVisiblePaymentMethods,
  shouldShowAccount,
  shouldShowWishlist,
} from "../../src/components/layout/navigation-model";

describe("F4 shell visibility", () => {
  const settings = validatePublicStoreSettings(DEVELOPMENT_STORE_SETTINGS_FIXTURE).settings;

  test("hides unverified commercial surfaces", () => {
    expect(getAnnouncementText(settings)).toBeNull();
    expect(getConfirmedPhones(settings)).toEqual([]);
    expect(getConfirmedEmails(settings)).toEqual([]);
    expect(getConfirmedSocialLinks(settings)).toEqual([]);
    expect(getVisiblePaymentMethods(settings)).toEqual([]);
  });

  test("uses validated feature visibility", () => {
    expect(shouldShowWishlist(settings)).toBe(true);
    expect(shouldShowAccount(settings)).toBe(false);
  });
});
