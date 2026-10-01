import {
  Button,
  Dialog,
  DialogTrigger,
  IconButton,
  Popover,
  Tooltip,
  TooltipTrigger,
} from '@plurid/carved-ui-react';

const Info = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </svg>
);

export default function Example() {
  return (
    <div className="row">
      <DialogTrigger>
        <Button variant="secondary">Details</Button>
        <Popover showArrow placement="bottom start">
          <Dialog title="Quarry" description="Deployed four minutes ago from main." />
        </Popover>
      </DialogTrigger>
      <TooltipTrigger delay={300}>
        <IconButton aria-label="About deploys">
          <Info />
        </IconButton>
        <Tooltip showArrow>Deploys run on every push to main.</Tooltip>
      </TooltipTrigger>
    </div>
  );
}
