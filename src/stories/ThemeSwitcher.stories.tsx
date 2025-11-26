import type { Meta, StoryObj } from "@storybook/react";
import { ThemeSwitcher } from "@/shared/components/themeSwitcher/ThemeSwitcher";
import { Button } from "@/shared/components/button/Button";
import { InputText } from "@/shared/components/inputText/InputText";
import { Textarea } from "@/shared/components/textarea/Textarea";
import { Select } from "@/shared/components/select/Select";
import { ThemeProvider } from "@/shared/providers/theme";

const meta: Meta<typeof ThemeSwitcher> = {
  title: "Shared/ThemeSwitcher + ThemeProvider",
  component: ThemeSwitcher,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h2>Theme Switcher + ThemeProvider</h2>
          <ThemeSwitcher />
        </div>

        <div style={{ marginTop: 40 }}>
          <h3>Component Preview</h3>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 400,
            marginTop: 16
          }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>

            <InputText placeholder="Enter some text..." />

            <Textarea placeholder="Enter some longer text..." rows={3} />

            <Select
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
              ]}
              placeholder="Select an option..."
              onChange={() => { }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  ),
};
