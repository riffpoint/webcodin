<?php

/**
 * This file is part of the Block of creating of .xml-documents
 * see https://www.postfinance.ch/
 *
 * @author WebCodin <info@webcodin.com>
 */

namespace SharelyPayment\Model\Block;

use SharelyCatalog\Model\Business\ProductRentRequest;
use SharelyPromote\Model\Business\PromoteUser;
use SharelyReferal\Model\Business\ReferalUser;
use SharelyEBanking\Model\Business\EBanking;

/**
 * 
 * @author WebCodin <info@webcodin.com>
 * @package SharelyPayment\Model\Block
 */
class PaymentXmlDoc
{

    const XMLNS = 'http://www.six-interbank-clearing.com/de/pain.001.001.03.ch.02.xsd';
    const XSI = 'http://www.w3.org/2001/XMLSchema-instance';
    const SCHEMA_LOCATION = 'http://www.six-interbank-clearing.com/de/pain.001.001.03.ch.02.xsd  pain.001.001.03.ch.02.xsd';
    const EXEC_DATE_FORMAT = 'Y-m-d';
    const STORNO_MESS = 'Sharely.ch Vergütung Storno.';
    const DANKE_MESS = 'Sharely.ch Vermietertrag. Vielen Dank!';
    const PROMO_MESS = 'Sharely.ch Promo Belohnung';
    const REFUND_MESS = 'Erstattung zu viel bezahlter Betrag.';
    const REFERAL_MESS = 'Sharely.ch Promo Belohnung';

    private static $instance = null;
    private $dirPath;
    private $dom;
    private $collection;
    private $executionDate;
    private $controlSum;
    private $transactionNumber;
    private $idPrefix;
    private $bettaSpecificData = array();

    /**
     * @var array Contains configurations for first level
     */
    private $configAlfaModel = array(
        'name'     => 'GrpHdr',
        'children' => array(
            array(
                'name'      => 'MsgId',
                'value'     => array('SharelyPayment\Model\AlfaModel', 'getMessageId'),
                'attribute' => array()
            ),
            array(
                'name'      => 'CreDtTm',
                'value'     => array('SharelyPayment\Model\AlfaModel', 'getCreationDateTime'),
                'attribute' => array()
            ),
            array(
                'name'      => 'NbOfTxs',
                'value'     => array('SharelyPayment\Model\AlfaModel', 'getNumberOfTransactions'),
                'attribute' => array()
            ),
            array(
                'name'      => 'CtrlSum',
                'value'     => array('SharelyPayment\Model\AlfaModel', 'getControlSum'),
                'attribute' => array()
            ),
            array(
                'name'      => 'InitgPty',
                'value'     => null,
                'attribute' => array(),
                'children'  => array(
                    array(
                        'name'  => 'Nm',
                        'value' => array('SharelyPayment\Model\AlfaModel', 'getInitiatingPartyName')
                    )
                )
            ),
        )
    );

    /**
     * @var array Contains configurations for second level
     */
    private $configBettaModel = array(
        'name'     => 'PmtInf',
        'children' => array(
            array(
                'name'  => 'PmtInfId',
                'value' => array('SharelyPayment\Model\BettaModel', 'getPaymentInformationId'),
            ),
            array(
                'name'  => 'PmtMtd',
                'value' => array('SharelyPayment\Model\BettaModel', 'getPaymentMethod'),
            ),
            array(
                'name'  => 'BtchBookg',
                'value' => array('SharelyPayment\Model\BettaModel', 'getBatchBooking'),
            ),
            array(
                'name'  => 'ReqdExctnDt',
                'value' => array('SharelyPayment\Model\BettaModel', 'getRequestedExecutionDate'),
            ),
            array(
                'name'     => 'Dbtr',
                'children' => array(
                    array(
                        'name'  => 'Nm',
                        'value' => array('SharelyPayment\Model\BettaModel', 'getDebtorName'),
                    ),
                ),
            ),
            array(
                'name'     => 'DbtrAcct',
                'children' => array(
                    array(
                        'name'     => 'Id',
                        'children' => array(
                            array(
                                'name'  => 'IBAN',
                                'value' => array('SharelyPayment\Model\BettaModel', 'getDebtorAccountId'),
                            ),
                        )
                    ),
                ),
            ),
            array(
                'name'     => 'DbtrAgt',
                'children' => array(
                    array(
                        'name'     => 'FinInstnId',
                        'children' => array(
                            array(
                                'name'  => 'BIC',
                                'value' => array('SharelyPayment\Model\BettaModel', 'getDebtorAgentCode'),
                            )
                        ),
                    )
                ),
            )
        ),
    );

    /**
     * @var array Contains configurations for third level
     */
    protected $configGammaModel = array(
        'name'     => 'CdtTrfTxInf',
        'children' => array(
            array(
                'name'     => 'PmtId',
                'children' => array(
                    array(
                        'name'  => 'InstrId',
                        'value' => array('SharelyPayment\Model\GammaModel', 'getPaymentInstructionId'),
                    ),
                    array(
                        'name'  => 'EndToEndId',
                        'value' => array('SharelyPayment\Model\GammaModel', 'getPaymentEndToEndId')
                    )
                )
            ),
            array(
                'name'     => 'Amt',
                'children' => array(
                    array(
                        'name'      => 'InstdAmt',
                        'value'     => array('SharelyPayment\Model\GammaModel', 'getAmount'),
                        'attribute' => array(
                            'Ccy' => array('SharelyPayment\Model\GammaModel', 'getCurrencyCode')
                        )
                    ),
                )
            ),
            array(
                'name'     => 'CdtrAgt',
                'children' => array(
                    array(
                        'name'     => 'FinInstnId',
                        'children' => array(
                            array(
                                'name'     => 'ClrSysMmbId',
                                'children' => array(
                                    array(
                                        'name'     => 'ClrSysId',
                                        'children' => array(
                                            array(
                                                'name'  => 'Cd',
                                                'value' => array('SharelyPayment\Model\GammaModel', 'getFinInstnCode')
                                            )
                                        )
                                    ),
                                    array(
                                        'name'  => 'MmbId',
                                        'value' => array('SharelyPayment\Model\GammaModel', 'getMemberId')
                                    )
                                )
                            )
                        )
                    )
                )
            ),
            array(
                'name'     => 'Cdtr',
                'children' => array(
                    array(
                        'name'  => 'Nm',
                        'value' => array('SharelyPayment\Model\GammaModel', 'getCreditorName'),
                    ),
                    array(
                        'name'     => 'PstlAdr',
                        'children' => array(
                            array(
                                'name'  => 'StrtNm',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getStreetName')
                            ),
                            array(
                                'name'  => 'BldgNb',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getBuildingNumber')
                            ),
                            array(
                                'name'  => 'PstCd',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getPostCode')
                            ),
                            array(
                                'name'  => 'TwnNm',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getTownName')
                            ),
                            array(
                                'name'  => 'Ctry',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getCountry')
                            ),
                        )
                    )
                )
            ),
            array(
                'name'     => 'CdtrAcct',
                'children' => array(
                    array(
                        'name'     => 'Id',
                        'children' => array(
                            array(
                                'name'  => 'IBAN',
                                'value' => array('SharelyPayment\Model\GammaModel', 'getCreditorIban'),
                            )
                        )
                    ),
                )
            ),
            array(
                'name'     => 'RmtInf',
                'children' => array(
                    array(
                        'name'  => 'Ustrd',
                        'value' => array('SharelyPayment\Model\GammaModel', 'getRemittanceInformation')
                    )
                )
            )
        ),
    );

    private function __construct($collection = null, $date = null)
    {
        if (!$date) {
            $date = date(self::EXEC_DATE_FORMAT);
        }
        $this->executionDate = $date;
        $this->collection = $this->prepareCollection($collection);
        $this->dirPath = ROOT_DIR . '/public/docXml';
        $this->dom = new \domDocument("1.0", "utf-8");
        $this->dom->formatOutput = true;
    }

    /**
     * 
     * @param \Iterator $collection
     * @return array
     */
    private function prepareCollection($collection)
    {
        if (!$collection) {
            return null;
        }
        $creditors = array();
        $controlSum = 0.0;
        $transactionNumber = 0;

        foreach ($collection as $itemObject) {
            $iban = null;
            $amount = null;
            $message = '';

            $addedCreditor = array();

            //Repays overpayment to leaser
            if ($itemObject instanceof ProductRentRequest &&
                (int) $itemObject->getStatus() === ProductRentRequest::STATUS_CLOSED &&
                $itemObject->getEbankingObj()->getStatus() === EBanking::PAYMENT_STATUS_MORE) {

                $addAmount = (float) $itemObject->getRefundAmount(false) - (float) $itemObject->getAmountPrice(false);
                if (is_null($itemObject->getLeaser()->getValidIban())) {
                    $this->sendMail($itemObject, $addAmount);
                } elseif ($addAmount != 0) {
                    $leaser = $itemObject->getLeaser();
                    $refId = 'Ref-' . $itemObject->getId() . '-' . $itemObject->getProductId() . '-' . date('ymdHis');
                    $addedCreditor['amount'] = $addAmount;
                    $addedCreditor['iban'] = str_replace(' ', '', $itemObject->getLeaser()->get('iban'));
                    $addedCreditor['instrId'] = $refId;
                    $addedCreditor['endToEndId'] = $refId;
                    $addedCreditor['cdtrNm'] = $leaser->getName();
                    $addedCreditor['pstlAdr'] = $this->getAddresss($leaser);
                    $addedCreditor['ustrd'] = self::REFUND_MESS;
                }
            }

            //Repays payment to renter
            if ($itemObject instanceof ProductRentRequest &&
                $itemObject->getPaymentStatus() != ProductRentRequest::PAYMENT_STATUS_OK) {

                if ($this->isIncludeInCancelledStack($itemObject)) {
                    $user = $itemObject->getLeaser();
                    $amount = (float) $itemObject->getRefundAmount(false);
                    $message = self::STORNO_MESS;
                } elseif ((int) $itemObject->getStatus() === ProductRentRequest::STATUS_CLOSED) {
                    $user = $itemObject->getRenter();
                    $amount = (float) $itemObject->getPrice() * 0.8;
                    $message = self::DANKE_MESS;
                }

                if ($user instanceof \EvolaAccount\Model\Business\User && !is_null($user->getValidIban())) {
                    $iban = str_replace(' ', '', $user->get('iban'));
                    $itemObject->setPaymentStatus(ProductRentRequest::PAYMENT_STATUS_OK);
                    $ebanking = $itemObject->getEbankingObj();
                    if ($ebanking->getId()) {
                        $ebanking->setPaidOut(EBanking::PAID_OUT_YES);
                        $ebanking->save();
                    }
                } else {
                    $itemObject->setPaymentStatus(ProductRentRequest::PAYMENT_STATUS_NOIBAN);
                }
                $this->idPrefix = 'Sharely';
                $instrId = 'Ref-' . $itemObject->getId() . '-' . $itemObject->getProductId();
                $itemObject->saveWithoutValidate();

                //Repays reward to participants of promotion actions
            } elseif ($itemObject instanceof PromoteUser &&
                $itemObject->get('paymentStatus') != PromoteUser::PAYMENT_STATUS_OK) {
                $user = $itemObject->getUser();
                $amount = (float) $itemObject->getPromoAction()->getReward();
                $message = self::PROMO_MESS;
                $this->idPrefix = 'Sharely-Promo';
                $instrId = 'RefPromo-' . $user->getId() . '-' . $itemObject->getPromoteId();
                $promoUser = new PromoteUser();
                $promoUser->load($itemObject->getId());
                if ($user instanceof \EvolaAccount\Model\Business\User && !is_null($user->getValidIban())) {
                    $iban = str_replace(' ', '', $user->get('iban'));
                    $promoUser->set('paymentStatus', PromoteUser::PAYMENT_STATUS_OK);
                } else {
                    $promoUser->set('paymentStatus', PromoteUser::PAYMENT_STATUS_NOIBAN);
                }
                $promoUser->save();

                //Repays reward to participants of partner programs   
            } elseif ($itemObject instanceof ReferalUser &&
                $itemObject->getPaymentStatus() != ReferalUser::PAYMENT_STATUS_OK) {
                $user = $itemObject->getUser();
                $amount = (float) $itemObject->getReferal()->getReward();
                $message = self::REFERAL_MESS;
                $this->idPrefix = 'Sharely-Partner';
                $instrId = 'RefPartnerl-' . $user->getId() . '-' . $itemObject->getReferalId();
                $referalUser = new ReferalUser();
                $referalUser->load($itemObject->getId());
                if ($user instanceof \EvolaAccount\Model\Business\User && !is_null($user->getValidIban())) {
                    $iban = str_replace(' ', '', $user->get('iban'));
                    $referalUser->set('paymentStatus', ReferalUser::PAYMENT_STATUS_OK);
                } else {
                    $referalUser->set('paymentStatus', ReferalUser::PAYMENT_STATUS_NOIBAN);
                }
                $referalUser->save();
            }

            if ($iban && $amount) {
                $controlSum += $amount;
                $transactionNumber++;
                $address = $this->getAddresss($user);
                $creditors[] = array(
                    'amount'     => number_format($amount, 2, '.', ''),
                    'iban'       => $iban,
                    'instrId'    => $instrId,
                    'endToEndId' => $instrId,
                    'cdtrNm'     => $user->getName(),
                    'pstlAdr'    => $address,
                    'ustrd'      => $message,
                );
            }

            if ($addedCreditor) {
                $transactionNumber++;
                $amount = $addedCreditor['amount'];
                $ebanking = $itemObject->getEbankingObj();
                $ebanking->setStatus(EBanking::PAYMENT_STATUS_PAID);
                $ebanking->setPaidOut(EBanking::PAID_OUT_NONEED);
                $exactAmount = (float) $ebanking->getPaidAmount() - (float) $amount;
                $ebanking->setPaidAmount($exactAmount);
                $ebanking->save();
                $controlSum += $amount;
                $addedCreditor['amount'] = number_format($amount, 2, '.', '');
                $creditors[] = $addedCreditor;
            }
        }
        $this->controlSum = $controlSum;
        $this->transactionNumber = $transactionNumber;
        return $creditors;
    }

    /**
     * 
     * @param ProductRentRequest $object
     * @param float $addAmount
     */
    private function sendMail(ProductRentRequest $object, $addAmount)
    {
        $user = $object->getLeaser();

        $data['mail'] = new \stdClass();

        $data['mail']->from = \Evola\Setting::get('site/info/meta/email');
        $data['mail']->to = $user->getEmail();

        $data['object'] = new \stdClass();
        $data['object']->name = $object->getProduct()->getName();

        $data['data'] = new \stdClass();
        $data['data']->link = 'myAccount/';

        $data['data']->amount = $addAmount;
        $data['data']->name = $user->getFirstname();

        $messageServer = new \EvolaMessaging\Controller\MessageServer();

        $messageServer->sendMessage('Payment_5', (object) $data);
    }

    /**
     * determines a possibility to include one into the document
     * 
     * @param ProductRentRequest $object
     * @return boolean
     */
    private function isIncludeInCancelledStack(ProductRentRequest $object)
    {
        if ((int) $object->getStatus() === ProductRentRequest::STATUS_CANCELLED_LEASER ||
            (int) $object->getStatus() === ProductRentRequest::STATUS_CANCELLED_RENTER) {

            $eBankingObj = $object->getEbankingObj();
            if ($eBankingObj->getId() && (float) $eBankingObj->getPaidAmount() == 0) {
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * 
     * @param \EvolaAccount\Model\Business\Account $user
     * @return array
     */
    private function getAddresss(\EvolaAccount\Model\Business\Account $user)
    {
        $address = array();
        if ($user && $user->getMainAddress() instanceof \EvolaAccount\Model\Business\Address) {
            $street = str_replace(',', ' ', $user->getMainAddress()->getStreet());
            $street = explode(' ', $street);
            $buildingNumber = ((int) end($street)) ? end($street) : '';
            if ($buildingNumber) {
                array_pop($street);
            }
            $street = implode(' ', $street);
            $address = array(
                'strtNm' => $street,
                'bldgNb' => $buildingNumber,
                'pstCd'  => $user->getMainAddress()->getZip(),
                'twnNm'  => $user->getMainAddress()->getCity(),
                'ctry'   => 'CH'
            );
        }
        return $address;
    }

    /**
     * 
     * @param \DOMElement $node
     * @param array $params
     * @return \DOMElement
     */
    private function getNode($node, $params = null)
    {
        $dom = $this->dom;
        $elt = $dom->createElement($node['name']);

        foreach ($node['children'] as $value) {
            if ($child = $this->getTreeNodes($dom, $value, $params)) {
                $elt->appendChild($child);
            }
        }
        return $elt;
    }

    /**
     * 
     * @param \DOMDocument $dom
     * @param \DOMElement $parent
     * @param array $params
     * @return \DOMElement
     */
    private function getTreeNodes($dom, $parent, $params = null)
    {

        if (isset($parent['value']) && is_callable($parent['value'])) {
            $value = call_user_func($parent['value'], $params);
        } elseif (isset($parent['value']) && !is_array($parent['value'])) {
            $value = $parent['value'];
        } else {
            $value = null;
        }

        if ($value || (isset($parent['children']) && is_array($parent['children']))) {

            $node = $dom->createElement($parent['name'], $value);
        } else {
            return null;
        }

        if (isset($parent['attribute']) && is_array($parent['attribute'])) {
            foreach ($parent['attribute'] as $key => $val) {
                if (is_array($val) && is_callable($val)) {
                    $attr = call_user_func($val);
                } else {
                    $attr = $val;
                }
                $node->setAttribute($key, $attr);
            }
        }

        if (isset($parent['children']) && is_array($parent['children'])) {
            foreach ($parent['children'] as $item) {
                if ($child = $this->getTreeNodes($dom, $item, $params)) {
                    $node->appendChild($child);
                }
            }
        }
        return $node;
    }

    /**
     * 
     * @param \Iterator $collection
     * @param string $date
     * @return PaymentXmlDoc
     */
    public static function get($collection = null, $date = null)
    {
        if (empty(self::$instance)) {
            self::$instance = new self($collection, $date);
        }

        return self::$instance;
    }

    /**
     * 
     * @return \DOMDocument
     * @throws \Exception
     */
    public function run()
    {
        if (!$this->collection) {
            throw new \Exception('Collection is empty!');
        }

        $dom = $this->dom;
        $document = $dom->createElement('Document');
        $document->setAttribute('xmlns', self::XMLNS);
        $document->setAttribute('xmlns:xsi', self::XSI);
        $document->setAttribute('xsi:schemaLocation', self::SCHEMA_LOCATION);
        $dom->appendChild($document);

        $root = $dom->createElement('CstmrCdtTrfInitn');
        $document->appendChild($root);

        $levelA = $this->getNode($this->configAlfaModel, $this);
        $root->appendChild($levelA);

        $levelB = $this->getNode($this->configBettaModel, $this);

        foreach ($this->collection as $item) {
            $levelB->appendChild($this->getNode($this->configGammaModel, $item));
        }
        $root->appendChild($levelB);

        return $dom;
    }

    /**
     * 
     * @return float
     */
    public function getControlSum()
    {
        return $this->controlSum;
    }

    /**
     * 
     * @return integer
     */
    public function getTransactionNumber()
    {
        return $this->transactionNumber;
    }

    /**
     * 
     * @return string
     */
    public function getExecutionDate()
    {
        return $this->executionDate;
    }

    /**
     * 
     * @return string
     */
    public function getPrefix()
    {
        return $this->idPrefix;
    }

    /**
     * 
     * @param array $data
     */
    public function setBettaSpecificData($data = array())
    {
        $this->bettaSpecificData = $data;
    }

    /**
     * 
     * @return array
     */
    public function getBettaSpecificData()
    {
        return $this->bettaSpecificData;
    }

}
