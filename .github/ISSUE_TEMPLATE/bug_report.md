name: Bug Report
description: File a report to help us improve
labels: ["bug"]
body:
  - type: textarea
    id: reproduction
    attributes:
      label: Reproduction Steps
      description: How did you encounter this bug?
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
    validations:
      required: true
