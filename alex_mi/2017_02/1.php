<?php

namespace App\Http\Controllers;

use App\Facades\ElasticSearch;
use App\Models\Product;
use App\Repository\ProductRepository;
use Elasticsearch\Common\Exceptions\ElasticsearchException;
use Illuminate\Http\Request;

/**
 *
 * The class responsible for index, search with wildcard and completition suggester methods.
 *
 * Class ESController
 * @package App\Http\Controllers
 */
class ESController extends Controller implements IndexingInterface
{

    const DEFAULT_PRODUCT_INDEX = 'products';
    const DEFAULT_PRODUCT_TYPE = 'product';
    const DEFAULT_RECORDS_LIMIT = 100;
    const ES_BULK_LIMIT = 1000;
    const ES_SUGGESTION_INDEX = 'name_suggest';
    const ES_SEARCH_SUGGESTIONS_TYPE = 1;
    const ES_SEARCH_WILD_TYPE = 0;

    /**
     * @var ProductRepository
     */
    private $productRepo;

    /**
     * ESController constructor.
     *
     * @param ProductRepository $productRepository
     */
    public function __construct(
        ProductRepository $productRepository
    )
    {
        $this->productRepo = $productRepository;
    }

    /**
     * 
     * The method checks if elasticsearch service is working correctly.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function ping()
    {

        try {
            ElasticSearch::ping();
            return response()->json('OK');
        }
        catch (\Exception $e) {
            return response()->json('ERROR');
        }
    }

    /**
     *
     * Index elasticsearch documents depends on selected user parameter (limit).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {

        $response = [];
        $response['error'] = false;

        if($request->isXmlHttpRequest() && $request->has('limit')) {

            try {

                $this->createESIndex();
                
                $products = Product::orderBy('id', 'asc')->take($request->get('limit'))->get();

                $timeStart = microtime(true);

                $params = ['body' => []];
                $i = 0;

                /** @var Product $product */
                foreach ($products as $product) {
                    $params['body'][] = [
                        'index' => [
                            '_index' => self::DEFAULT_PRODUCT_INDEX,
                            '_type' => self::DEFAULT_PRODUCT_TYPE,
                            '_id' => $product->id
                        ]
                    ];

                    $params['body'][] = [
                        'id' => $product->id,
                        'name' => $product->name,
                        'description' => $product->description,
                        'code' => $product->code,
                        'color' => $product->color,
                        'price' => $product->price,
                        'image' => $product->image,
                        'name_suggest' => [
                            'input'     => [
                                $product->name
                            ],
                            'output' => [
                                $product->name
                            ]
                        ]
                    ];

                    if ($i % self::ES_BULK_LIMIT == 0) {
                        $responses = ElasticSearch::bulk($params);

                        $params = ['body' => []];

                        unset($responses);
                    }

                    $i++;
                }

                if (!empty($params['body'])) {
                    ElasticSearch::bulk($params);
                }

                $timeEnd = microtime(true);
                $response['executionTime'] = round($timeEnd - $timeStart, 2) . ' sec';

            } catch (\Exception $e) {
                $response['error'] = true;
            }
        }

        return response()->json($response);
    }

    /**
     *
     * The method returns matches documents that have fields matching a wildcard expression.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $response = [];
        $response['error'] = false;

        if(
            $request->isXmlHttpRequest() && $request->getMethod() == 'POST' && $request->has('query')
        ) {

            $params = [
                'index' => self::DEFAULT_PRODUCT_INDEX,
                'type' => self::DEFAULT_PRODUCT_TYPE,
                'body' => [
                    'query' => [
                        'wildcard' => [
                            'name' => '*' . trim($request->get('query')) . '*'
                        ],
                    ],
                    "size" => 0,
                    'aggs' => [
                        'by_name' => [
                            'terms' => [
                                'field' => "name",
                            ],
                            'aggs' => [
                                'by_top_hit' => [ 'top_hits' => [ 'size' => 1 ] ],
                            ]
                        ]
                    ]
                ]
            ];

            $response['es'] = ElasticSearch::search($params);
            $response['type'] = self::ES_SEARCH_WILD_TYPE;
        }

        return response()->json($response);

    }

    /**
     *
     * ElasticSearch. Completion Suggester.
     * 
     * The method returns suggester provides auto-complete/search-as-you-type functionality.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchWithSuggest(Request $request)
    {
        $response = [];
        $response['error'] = false;

        if(
            $request->isXmlHttpRequest() && $request->getMethod() == 'POST' && $request->has('query')
        ) {

            $params = [
                'body' => [
                    'name_suggest' => [
                        'text' => $request->get('query'),
                        'completion' => [
                            'field' => 'name_suggest'
                        ]
                    ]
                ]
            ];

            $response['es'] = ElasticSearch::suggest($params);
            $response['type'] = self::ES_SEARCH_SUGGESTIONS_TYPE;
        }

        return response()->json($response);
    }

    /**
     *  Method creates ElasticSearch index and puts mappings from configuration file.
     *
     * @throws ElasticsearchException
     */
    public function createESIndex()
    {

        try {

            if(ElasticSearch::indices()->exists(['index' => self::DEFAULT_PRODUCT_INDEX])) {
                $this->clearESDocuments();
            }

            $params = [
                'index' => self::DEFAULT_PRODUCT_INDEX,
            ];

            ElasticSearch::indices()->create($params);
            ElasticSearch::indices()->putMappings(Config::get('fulltextsearch.elastic.mappings'));

        } catch (\Exception $e) {
            throw new ElasticsearchException();
        }

    }

    /**
     *
     * Method clears ElasticSearch index
     *
     * @throws ElasticsearchException
     */
    private function clearESDocuments()
    {

        try {

            $params = [
                'index' => self::DEFAULT_PRODUCT_INDEX,
                'type' => self::DEFAULT_PRODUCT_TYPE
            ];

            ElasticSearch::indices()->deleteMapping($params);

        } catch (\Exception $e) {
            throw new ElasticsearchException();
        }
    }
}

