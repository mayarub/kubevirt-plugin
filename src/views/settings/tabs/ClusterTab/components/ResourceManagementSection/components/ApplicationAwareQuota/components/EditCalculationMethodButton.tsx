import React, { type FC } from 'react';

import EditButton from '@kubevirt-utils/components/EditButton/EditButton';
import { useModal } from '@kubevirt-utils/components/ModalProvider/ModalProvider';
import { type HyperConverged } from '@kubevirt-utils/hooks/useHyperConvergeConfiguration';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { type CalculationMethod } from '@kubevirt-utils/resources/quotas/types';
import { Tooltip, TooltipPosition } from '@patternfly/react-core';

import { type CalculationMethodContentMapper } from '../types';

import EditCalculationMethodModal from './EditCalculationMethodModal';

type EditCalculationMethodButtonProps = {
  calculationMethodContentMapper: CalculationMethodContentMapper;
  hyperConverge: HyperConverged;
  selectedCalculationMethod: CalculationMethod;
};

const EditCalculationMethodButton: FC<EditCalculationMethodButtonProps> = ({
  calculationMethodContentMapper,
  hyperConverge,
  selectedCalculationMethod,
}) => {
  const { t } = useKubevirtTranslation();
  const { createModal } = useModal();

  const onClick = () => {
    createModal(({ isOpen, onClose }) => (
      <EditCalculationMethodModal
        calculationMethodContentMapper={calculationMethodContentMapper}
        hyperConverge={hyperConverge}
        initiallySelectedMethod={selectedCalculationMethod}
        isOpen={isOpen}
        onClose={onClose}
      />
    ));
  };

  return (
    <Tooltip content={t('Edit quota calculation method')} position={TooltipPosition.right}>
      <EditButton ariaLabel={t('Edit quota calculation method')} onClick={onClick} />
    </Tooltip>
  );
};

export default EditCalculationMethodButton;
