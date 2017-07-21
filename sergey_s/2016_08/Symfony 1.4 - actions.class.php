<?php

/**
 * newPiano actions.
 *
 * @package    negina
 * @subpackage newPiano
 * @author WebCodin <info@webcodin.com>
 */
class newPianoActions extends sfActions
{
    /**
     * Executes index action
     *
     * @param sfWebRequest $request A request object
     */
    public function executeIndex(sfWebRequest $request)
    {
        $pl = new PianoLesson();
        $this->lesson = $pl->getBySong(
            $request->getParameter('song'),
            $this->getUser()->getCulture()
        );
        $this->forward404Unless($this->lesson);
        $this->genres = array();
        $this->genres[$this->lesson->getSong()->getGenre()->getSlug()]
            = $this->lesson->getSong()->getGenre()->getName();
        foreach ($this->lesson->getSong()->getGenres() as $genre) {
            $this->genres[$genre->getSlug()] = $genre->getName();
        }

        $pl->addStat($this->lesson->getId());

        $this->getUser()->setAttribute(
            'last_piano_lesson',
            $this->lesson->getId()
        );

        $song = new Song();
        $this->moreFromGenre = $song->getMoreByGenre(
            $this->lesson->getSong()->getGenreId(),
            $this->lesson->getSong()->getId(), 'haspl'
        );
        $this->moreFromArtist = $song->getMoreByArtist(
            $this->lesson->getArtistId(),
            $this->lesson->getSong()->getId(),
            'haspl'
        );

        $this->isUserPremium = ($this->lesson->getIsFree()
            || $this->getUser()->hasPermission('piano'));
        $this->isBlocked = false;

        if (!$this->isUserPremium) {

            $timer = PianoLessonBlockTable::getTimer(
                $request->getRemoteAddress()
            );

            if ($timer >= sfConfig::get('app_block_piano')) {

                $this->isBlocked = true;
            }
        }

        $this->level = 1;
        $this->id = $this->lesson->getSongId();

        $mobile = new Mobile_Detect();
        $this->rotate = false;

        if ($mobile->isMobile() && !$mobile->isTablet()) {

            $this->rotate = true;
        }
        $options = sfContext::getInstance()->getRouting()->getOptions();
        $this->oldlink = '/old' . $options['context']['path_info'];
        $this->mobile = false;

        if ($mobile->isMobile()) {

            $this->mobile = true;
            $this->getResponse()->setSlot('ismobile', 'yes');


        }

    }

    /**
     * @param sfRequest $request
     * @throws Exception
     */

    public function executeCourse(sfRequest $request)
    {
        $mobile = new Mobile_Detect();
        $type = $request->getParameter('t', false);
        $id = $request->getParameter('i');
        $fid = $request->getParameter('fi');

        if ('guitar' != $type && 'piano' != 'piano') {
            throw new Exception('Wrong course type');
        }

        if (!is_numeric($id) || !is_numeric($fid)) {
            throw new Exception('Wrong course or file id');
        }

        $course = sfYaml::load(sfConfig::get('sf_data_dir') . '/courses/' . $type . '.yml');
        $course = $course[$id];
        $this->isFree = $course['free'];

        $this->isUserPremium = $this->getUser()->isPremium();
        if ($this->getUser()->isPremium() || $course['free']) {
            $this->isFree = true;
        }
        sfConfig::set('sf_web_debug', false);

        $this->id = 'course-' . $id . '-' . $fid;
        $this->request = time();
        $this->level = 1;
        $this->ver = 2;
        sfConfig::set('sf_escaping_strategy', false);
        $this->oldlink = $this->getController()->genUrl(sprintf('@oldcourse?f=c&t=%s&i=%d', 'piano', $id)) . "&fi=" . $fid;
        $this->mobile = false;
        if ($mobile->isMobile()) {
            $this->mobile = true;
        }


    }
}
