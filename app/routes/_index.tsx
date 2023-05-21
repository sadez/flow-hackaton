import { Box, Container, Divider, Heading, Table, TableContainer, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import TableHeader from '~/components/TableHeader';
import { getAmazonsStocks, getGooglesStocks } from '~/models/stocks.server';
import { getOperationsFromTwoStocks } from '~/utils/utils';

const INITIAL_AMOUNT = 100000;

export const loader = async () => {
  let initialAmount: number = INITIAL_AMOUNT;
  var startTime = performance.now();

  const amazonsStocks = await getAmazonsStocks();
  const googleStocks = await getGooglesStocks();

  // order stocks by timestamp
  await amazonsStocks.sort((a, b) => a.timestamp - b.timestamp);
  await googleStocks.sort((a, b) => a.timestamp - b.timestamp);

  // find peaks and troughs

  let arrOprs = await getOperationsFromTwoStocks(initialAmount, amazonsStocks, googleStocks);
  var endTime = performance.now();

  return json({
    listOfOperations: arrOprs,
    performanceTime: endTime - startTime,
  });
};

export default function IndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container maxW='container.xl'>
      <Heading as='h1' size='xl' my='10'>
        Meilleur moment pour acheter et pour vendre
      </Heading>
      <Divider mb='10' />
      <Text fontSize='md' mb='10'>
        Liste des achats et ventes quotidiens de Salim
      </Text>

      <Box overflow={'auto'} height={'xl'} my={10}>
        <TableContainer mb='10'>
          <Table variant='striped' borderWidth={1}>
            <TableHeader />

            <Tbody>
              {data.listOfOperations.map(({ operation, stock, amount, price, inHands, timestamp, total }) => (
                <Tr key={timestamp + price}>
                  <Td>
                    {/* format to 01/12/2022 */}
                    {new Date(timestamp).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                  </Td>
                  <Td color={operation === 'buy' ? 'green.500' : 'red.500'}>{operation === 'buy' ? 'Achat' : 'Vente'}</Td>
                  <Td>{stock.toUpperCase()}</Td>
                  <Td>{price + ' €'}</Td>
                  <Td>{amount}</Td>
                  <Td>{total.toFixed(2) + ' €'}</Td>
                  <Td>{inHands.toFixed(2) + ' €'} </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Text fontSize='md' mb='10'>
        Temps total d'exécution : {data.performanceTime.toFixed(2)} ms
      </Text>
    </Container>
  );
}
