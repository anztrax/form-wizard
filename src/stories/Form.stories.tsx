import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Form, FormField, FormGap, FormLayout } from '@/common/components/form/Form';
import { InputText } from '@/common/components/inputText/InputText';
import { Button } from '@/common/components/button/Button';
import { Select } from '@/common/components/select/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .email({ message: "Invalid email address" }),
  country: z.string().optional(),
});

const meta = {
  title: "Shared/Form",
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: { type: "select" },
      options: ["vertical"]
    },
    gap: {
      control: { type: "select" },
      options: ["sm", "md", "lg"]
    },
  },
  args: {
    layout: "vertical",
    gap: "md",
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;


type FormValues = z.infer<typeof formSchema>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'id', label: 'Indonesia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

function Template(props: { layout: FormLayout, gap: FormGap }) {
  const {
    layout,
    gap
  } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const countryValue = watch('country');

  const onSubmit = (data: FormValues) => {
    console.info(`Submitted:\nName: ${data.name}\nEmail: ${data.email}\nCountry: ${data.country || 'N/A'}`);
  };

  const handleCountryChange = (value: string | null) => {
    setValue('country', value || '');
  };

  return (
    <Form
      layout={layout}
      gap={gap}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        label="Name"
        htmlFor="name"
        required
        error={errors.name?.message}
        helpText="Please enter your full name."
      >
        <InputText
          size='md'
          id="name"
          placeholder="John Doe"
          hasError={Boolean(errors.name)}
          {...register('name')}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="email"
        required
        error={errors.email?.message}
      >
        <InputText
          size='md'
          id="email"
          type="email"
          placeholder="you@example.com"
          hasError={Boolean(errors.email)}
          {...register('email')}
        />
      </FormField>

      <FormField
        label="Country"
        htmlFor="country"
        helpText="Optional"
      >
        <Select
          size='md'
          options={countryOptions}
          placeholder="Select a country..."
          value={countryValue}
          onChange={handleCountryChange}
        />
      </FormField>

      <div style={{ marginTop: 16 }}>
        <Button type="submit" fullWidth>
          Submit
        </Button>
      </div>
    </Form>
  );
};

export const Playground: Story = {
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <Template
        layout={args.layout || 'vertical'}
        gap={args.gap || 'md'}
      />
    </div>
  ),
};
