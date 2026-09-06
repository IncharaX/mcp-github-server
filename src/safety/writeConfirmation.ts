export function requireConfirmation(
  confirm: boolean,
  actionDescription: string
) {
  if (!confirm) {
    return {
      confirmed: false,
      message: `DRY RUN — No action was executed.

${actionDescription}

Set confirm: true to execute this action.`,
    };
  }

  return {
    confirmed: true,
  };
}