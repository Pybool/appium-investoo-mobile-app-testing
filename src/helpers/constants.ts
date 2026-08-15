export type FieldCase = {
  label: string;
  value: string;
  expected: string;
  notes?: string;
};

export const EmailCases = [
  { label: "empty string", value: "", expected: "Enter a valid email" },
  {
    label: "no @ or domain",
    value: "plainaddress",
    expected: "Enter a valid email",
  },
  {
    label: "missing local part",
    value: "@missinglocal.com",
    expected: "Enter a valid email",
  },
  {
    label: "missing domain",
    value: "missingdomain@",
    expected: "Enter a valid email",
  },
  {
    label: "missing TLD",
    value: "missingtld@domain",
    expected: "Enter a valid email",
  },
  {
    label: "double @",
    value: "two@@symbols.com",
    expected: "Enter a valid email",
  },
  {
    label: "multiple @",
    value: "user@domain@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "space in local part",
    value: "user name@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "space in domain",
    value: "user@domain .com",
    expected: "Enter a valid email",
  },
  {
    label: "leading space",
    value: " user@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "trailing space",
    value: "user@domain.com ",
    expected: "Enter a valid email",
  },
  {
    label: "consecutive dots in local part",
    value: "user..name@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "leading dot in local part",
    value: ".user@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "trailing dot before @",
    value: "user.@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "domain starts with hyphen",
    value: "user@-domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "domain segment ends with hyphen",
    value: "user@domain-.com",
    expected: "Enter a valid email",
    notes:
      'A leading hyphen in the domain is correctly rejected ("user@-domain.com"), but a trailing hyphen before the dot is not ("user@domain-.com"). Likely an asymmetric quirk in Zod v3\'s built-in email() regex (app/(auth)/register.tsx), not custom validation logic in this codebase.',
  },
  {
    label: "consecutive dots in domain",
    value: "user@domain..com",
    expected: "Enter a valid email",
  },
  {
    label: "domain starts with dot",
    value: "user@.domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "comma instead of dot",
    value: "user@domain,com",
    expected: "Enter a valid email",
  },
  {
    label: "angle brackets / injection-shaped input",
    value: "user<script>@domain.com",
    expected: "Enter a valid email",
  },
  {
    label: "emoji in local part",
    value: "😀@domain.com",
    expected: "Enter a valid email",
  },
  ...[254, 255, 256].map((total) => {
    const domain = "@example.com";
    const local = "a".repeat(total - domain.length);
    return {
      label: `${total}-character email`,
      value: local + domain,
      expected: "",
      notes:
        "Neither the client Zod schema nor the backend RegisterRequest enforce a max email length, despite users.email being VARCHAR(255) in the DB. An email this long passes both validation layers and would only fail at the DB with a truncation/constraint error, not a clean 400.",
    };
  }),
];
