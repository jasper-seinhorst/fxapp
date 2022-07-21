import { FormGroup } from '@angular/forms';

export function NotContain(field: string, fields: string[]) {
    return (formGroup: FormGroup) => {
        const fieldItem = formGroup.controls[field];
        const fieldValue = fieldItem.value.toLowerCase();
        let hasError = false;

        if (fieldItem.errors && !fieldItem.errors['notContain']) {
            return;
        }

        fields.forEach(otherField => {
          const otherFieldItem = formGroup.controls[otherField];
          const otherFieldValue = otherFieldItem.value.toLowerCase();
          if (fieldValue.includes(otherFieldValue.toLowerCase())) {
            fieldItem.setErrors({ notContain: true });
            hasError = true;
          }
        });

        if (!hasError) {
          fieldItem.setErrors(null);
        }
    }
}
