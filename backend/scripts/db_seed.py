from sqlalchemy import select
from datetime import datetime, timezone
from uuid import UUID

from backend.database import db

from backend.models.user import User, Role
from backend.models.post import Post, Status
from backend.models.tag import Tag
from backend.models.post_tag import PostTag
from backend.models.ombudsman_question import (
    OmbudsmanQuestion,
    Status as OmbudsmanStatus,
    Type as OmbudsmanType,
)
from backend.models.ombudsman_message import OmbudsmanMessage

TEST_STUDENT_ID = "20241144010000"
TEST_ADMIN_ID = "20241144010099"

TEST_TAG_IDS = {
    "Notícia": UUID("10000000-0000-0000-0000-000000000001"),
    "Evento": UUID("10000000-0000-0000-0000-000000000002"),
    "Calendário": UUID("10000000-0000-0000-0000-000000000003"),
}

TEST_POST_IDS = {
    "semana-de-ciencia-e-tecnologia": UUID("20000000-0000-0000-0000-000000000001"),
    "feira-de-projetos-integradores": UUID("20000000-0000-0000-0000-000000000002"),
    "festival-junino-do-campus": UUID("20000000-0000-0000-0000-000000000003"),
}

TEST_QUESTION_ID = UUID("30000000-0000-0000-0000-000000000001")
TEST_MESSAGE_ID = UUID("40000000-0000-0000-0000-000000000001")

def create_seed_data():
    # Create user estudante
    test_student = db.session.get(User, TEST_STUDENT_ID)
    if test_student is None:
        test_student = User(user_id=TEST_STUDENT_ID)
    test_student.name = "Brasilicio Guilherme Kaio"
    test_student.email = "brasilicio.guilherme.kaio@escolar.ifrn.edu.br"
    test_student.course = "Informática"
    test_student.campus = "Parnamirim"
    test_student.role = Role.STUDENT

    # Create user admin
    test_admin = db.session.get(User, TEST_ADMIN_ID)
    if test_admin is None:
        test_admin = User(user_id=TEST_ADMIN_ID)
    test_admin.name = "Brasilicio Guilherme Kaio ADMIN"
    test_admin.email = "brasilicio.guilherme.kaio.admin@escolar.ifrn.edu.br"
    test_admin.course = "Informática"
    test_admin.campus = "Parnamirim"
    test_admin.role = Role.ADMIN

    db.session.add_all([test_student, test_admin])
    db.session.flush()

    # Create tags
    tags: dict[str, Tag] = {}
    for tag_name, tag_id in TEST_TAG_IDS.items():
        tag = db.session.get(Tag, tag_id)
        if tag is None:
            tag = db.session.scalar(select(Tag).where(Tag.name == tag_name))
        if tag is None:
            tag = Tag(tag_id=tag_id, name=tag_name)
        else:
            tag.name = tag_name
        db.session.add(tag)
        tags[tag_name] = tag
    db.session.flush()

    post_specs = [
        {
            "slug": "semana-de-ciencia-e-tecnologia",
            "title": "Semana de Ciência e Tecnologia reúne estudantes no campus",
            "subtitle": "Palestras, oficinas e exposições marcaram uma semana de troca de conhecimento.",
            "content": """A Semana de Ciência e Tecnologia movimentou o campus Parnamirim com atividades para todos os cursos. Estudantes participaram de palestras, minicursos e oficinas práticas conduzidas por professores e convidados externos.

Entre os destaques, a mostra de projetos permitiu que as turmas apresentassem trabalhos desenvolvidos ao longo do ano, aproximando a teoria vista em sala de aula de problemas reais da comunidade.

A organização avaliou o evento de forma positiva e já planeja novas edições, com mais espaço para a participação dos estudantes na construção da programação.""",
            "published_at": datetime(2026, 11, 3, 9, 0, tzinfo=timezone.utc),
            "tag_names": ["Notícia", "Evento"],
        },
        {
            "slug": "feira-de-projetos-integradores",
            "title": "Feira de Projetos Integradores destaca soluções criadas pelos alunos",
            "subtitle": "Trabalhos de diferentes turmas mostram como a tecnologia pode resolver problemas do dia a dia.",
            "content": """A Feira de Projetos Integradores reuniu equipes de várias turmas para apresentar suas ideias a professores, colegas e visitantes. Os trabalhos incluíram aplicativos, sites e protótipos pensados para necessidades da própria comunidade escolar.

Para os estudantes, o evento foi uma oportunidade de treinar a comunicação, receber feedback e perceber o impacto prático do que estudam.""",
            "published_at": datetime(2026, 10, 21, 14, 30, tzinfo=timezone.utc),
            "tag_names": ["Notícia", "Evento"],
        },
        {
            "slug": "festival-junino-do-campus",
            "title": "Festival Junino do campus celebra a cultura nordestina",
            "subtitle": "Quadrilhas, comidas típicas e muita música animaram a comunidade escolar.",
            "content": """O tradicional Festival Junino voltou ao campus com apresentações de quadrilha, barracas de comidas típicas e música ao vivo. Alunos, servidores e familiares participaram da festa.

Além da diversão, o evento reforçou a importância de valorizar as tradições da região e promoveu a integração entre turmas e cursos.""",
            "published_at": datetime(2026, 6, 26, 18, 0, tzinfo=timezone.utc),
            "tag_names": ["Evento", "Calendário"],
        },
    ]

    for spec in post_specs:
        post = db.session.get(Post, TEST_POST_IDS[spec["slug"]])
        if post is None:
            post = db.session.scalar(select(Post).where(Post.slug == spec["slug"]))
        if post is None:
            post = Post(post_id=TEST_POST_IDS[spec["slug"]], slug=spec["slug"])
        else:
            post.slug = spec["slug"]

        post.title = spec["title"]
        post.subtitle = spec["subtitle"]
        post.content = spec["content"]
        post.is_fixed = False
        post.status = Status.PUBLICADO
        post.published_at = spec["published_at"]
        post.published_by = TEST_ADMIN_ID
        post.updated_at = None
        post.updated_by = None
        post.deleted_at = None
        post.deleted_by = None
        post.tags = [tags[tag_name] for tag_name in spec["tag_names"]]
        db.session.add(post)

    # Create test ombudsman question and admin response
    question = db.session.get(OmbudsmanQuestion, TEST_QUESTION_ID)
    if question is None:
        question = db.session.scalar(
            select(OmbudsmanQuestion).where(
                OmbudsmanQuestion.user_id == TEST_STUDENT_ID,
                OmbudsmanQuestion.title == "Teste",
            )
        )
    if question is None:
        question = OmbudsmanQuestion(
            ombudsman_question_id=TEST_QUESTION_ID,
            user_id=TEST_STUDENT_ID,
        )

    question.title = "Teste"
    question.content = "Gostaria de saber como posso acompanhar as atividades oferecidas pelo campus."
    question.type = OmbudsmanType.DUVIDA
    question.status = OmbudsmanStatus.RESPONDIDO
    question.deleted_at = None
    db.session.add(question)
    db.session.flush()

    message = db.session.get(OmbudsmanMessage, TEST_MESSAGE_ID)
    if message is None:
        message = db.session.scalar(
            select(OmbudsmanMessage).where(
                OmbudsmanMessage.ombudsman_question_id == question.ombudsman_question_id,
                OmbudsmanMessage.user_id == TEST_ADMIN_ID,
            )
        )
    if message is None:
        message = OmbudsmanMessage(
            ombudsman_message_id=TEST_MESSAGE_ID,
            ombudsman_question_id=question.ombudsman_question_id,
            user_id=TEST_ADMIN_ID,
        )

    message.ombudsman_question_id = question.ombudsman_question_id
    message.user_id = TEST_ADMIN_ID
    message.content = (
        "As atividades podem ser acompanhadas pelo portal do campus e pelos "
        "avisos publicados nas redes oficiais."
    )
    message.deleted_at = None
    db.session.add(message)

    db.session.commit()


def remove_seed_data():
    # Remove test posts and their tag mappings
    test_posts = list(
        db.session.scalars(
            select(Post).where(
                (Post.post_id.in_(list(TEST_POST_IDS.values())))
                | (Post.slug.in_(list(TEST_POST_IDS.keys())))
            )
        ).all()
    )
    test_post_ids = [post.post_id for post in test_posts]
    if test_post_ids:
        db.session.execute(
            PostTag.__table__.delete().where(PostTag.post_id.in_(test_post_ids))
        )
        for post in test_posts:
            db.session.delete(post)
    db.session.flush()

    # Remove test ombudsman messages and question
    test_messages = list(
        db.session.scalars(
            select(OmbudsmanMessage).where(
                (OmbudsmanMessage.ombudsman_message_id == TEST_MESSAGE_ID)
                | (
                    (OmbudsmanMessage.ombudsman_question_id == TEST_QUESTION_ID)
                    & (OmbudsmanMessage.user_id == TEST_ADMIN_ID)
                )
            )
        ).all()
    )
    for message in test_messages:
        db.session.delete(message)

    test_questions = list(
        db.session.scalars(
            select(OmbudsmanQuestion).where(
                (OmbudsmanQuestion.ombudsman_question_id == TEST_QUESTION_ID)
                | (
                    (OmbudsmanQuestion.user_id == TEST_STUDENT_ID)
                    & (OmbudsmanQuestion.title == "Teste")
                )
            )
        ).all()
    )
    for question in test_questions:
        db.session.delete(question)
    db.session.flush()

    # Remove only tags that do not remain attached to another post
    test_tags = list(
        db.session.scalars(
            select(Tag).where(
                (Tag.tag_id.in_(list(TEST_TAG_IDS.values())))
                | (Tag.name.in_(list(TEST_TAG_IDS.keys())))
            )
        ).all()
    )
    for tag in test_tags:
        if not tag.posts:
            db.session.delete(tag)

    test_student = db.session.get(User, TEST_STUDENT_ID)
    test_admin = db.session.get(User, TEST_ADMIN_ID)
    for user in (test_student, test_admin):
        if user is not None:
            db.session.delete(user)

    db.session.commit()

    # Create three posts

if __name__ == "__main__":
    import argparse
    from backend.app import app

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "action",
        choices=["create", "remove"],
        help="Ação a executar nos dados de teste",
    )
    args = parser.parse_args()

    with app.app_context():
        if args.action == "create":
            create_seed_data()
            print("Dados de teste cadastrados!")
        elif args.action == "remove":
            remove_seed_data()
            print("Dados de teste removidos!")