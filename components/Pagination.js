import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Flex justifyContent="space-between" alignItems="center" mt={4}>
      <Text>
        Mostrando {startItem} - {endItem} de {totalItems} resultados
      </Text>
      <Flex>
        <Button
          leftIcon={<ChevronLeftIcon />}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          isDisabled={currentPage === 1}
          mr={2}
        >
          Anterior
        </Button>
        <Button
          rightIcon={<ChevronRightIcon />}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          isDisabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </Flex>
    </Flex>
  );
};

export default Pagination;
