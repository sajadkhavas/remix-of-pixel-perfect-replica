import { ContentPage, SupportLinks, UnconfiguredPolicyNotice } from "./PolicyPage";

export function LegalUnavailablePage({
  title,
  intro,
}: {
  readonly title: string;
  readonly intro: string;
}) {
  return (
    <ContentPage eyebrow="اطلاعات حقوقی" title={title} intro={intro}>
      <UnconfiguredPolicyNotice label={title}>
        <SupportLinks />
      </UnconfiguredPolicyNotice>
    </ContentPage>
  );
}
